import pool from "../db/index.ts";
import type { RoadmapInput, RoadmapResponse } from "../types/roadmaps.types.ts";
import { generateRoadmapFromAI } from "./ai.services.ts";
//Generate + Save raodmap

export const generateAndSaveRoadmap = async (
    userId: number,
    input: RoadmapInput
): Promise<RoadmapResponse> => {
    
    //Step 1: Get AI generated roadmap
    const aiRoadmap = await generateRoadmapFromAI(input);

    //Step 2: Save The Roadmap to DB
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const roadmapResult = await client.query(
            'INSERT INTO roadmaps (user_id, title, goal, level, duration) VALUES($1, $2, $3, $4, $5) RETURNING *',[userId, aiRoadmap.title, input.goal, input.level, input.duration]
        )
        const roadmap = roadmapResult.rows[0];

        //Step 3: Save each topic
        for(const topic of aiRoadmap.topics){
            const topicResult = await client.query(
                'INSERT INTO topics (roadmap_id, title, description, week_number, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *', [roadmap.roadmap_id, topic.title, topic.description, topic.weeK_number, topic.order_index]
            )
            const savedTopic = topicResult.rows[0];

            //Save resources for this topic
            for(const resource of topic.resources){
                await client.query(
                    `INSERT INTO resources (topic_id, title, url, type)
         VALUES ($1, $2, $3, $4)`,
                    [savedTopic.topic_id, resource.title, resource.url, resource.type]
                )
            }
        }

        await client.query("COMMIT");
        //step 4: Fetch and return complete roadmap
        return await getRoadmapById(roadmap.roadmap_id, userId)
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

//Fetch single roadmap with topics + resources

export const getRoadmapById = async (
    roadmapId: number,
    userId: number
):Promise<RoadmapResponse> => {
    //Get roadmap

    const roadmapResult = await pool.query(
        'SELECT * FROM roadmaps WHERE roadmap_id=$1 AND user_id = $2',[roadmapId, userId]
    )

    if(roadmapResult.rows.length === 0){
        throw new Error("Roadmap not found");
    }
    const roadmap = roadmapResult.rows[0];

    //GET Topics
    const topicsResult = await pool.query(
        'SELECT * FROM topics WHERE roadmap_id = $1 ORDER BY week_number, order_index',[roadmapId]
    )
    
    //GET resources for each topic
    const topics = await Promise.all(
        topicsResult.rows.map(async (topic)=>{
            const resourcesResult = await pool.query(
                'SELECT * FROM resources WHERE topic_id = $1',[topic.topic_id]
            )
            return { ...topic, resources: resourcesResult.rows }
        })
    )
    return {...roadmap, topics}
}

//Fetch all roadmaps for a user (no topics, just summary)

export const getUserRoadmaps = async (userId:number) => {
        const result = await pool.query(
            'SELECT r.roadmap_id, r.title, r.goal, r.level, r.duration, r.is_completed, r.created_at, COUNT(t.topic_id) AS total_topics FROM roadmaps r LEFT JOIN topics t ON t.roadmap_id = r.roadmap_id WHERE r.user_id = $1 GROUP BY r.roadmap_id ORDER BY r.created_at DESC',[userId]
        )
        return result.rows
}

//DELETE ROADMAP
export const deleteRoadmap = async (roadmapId: number, userId: number):Promise<void> => {
    const result = await pool.query(
        'DELETE FROM roadmaps WHERE roadmap_id=$1 AND user_id=$2',[roadmapId,userId]
    )

    if(result.rowCount === 0){
        throw new Error("Roadmap not found or unauthorized")
    }
}

