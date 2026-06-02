import pool from "../db/index.ts";
import { AppError } from "../middlewares/error.middleware.ts";
import type { RoadmapInput, RoadmapResponse, TopicResponse } from "../types/roadmaps.types.ts";
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
                'INSERT INTO topics (roadmap_id, title, description, week_number, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *', [roadmap.roadmap_id, topic.title, topic.description, topic.week_number, topic.order_index]
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
        throw new AppError("Roadmap not found",404);
    }
    const roadmap = roadmapResult.rows[0];

    //Single JOIN query - avoids N+1 (previouly one query fired per topic)

    const joinResult = await pool.query(`
        SELECT t.topic_id, t.title, t.description, t.week_number, t.order_index, t.created_at, r.resource_id, r.title AS resource_title, r.url, r.type FROM topics t LEFT JOIN resources r ON t.topic_id = r.topic_id WHERE t.roadmap_id = $1 ORDER BY t.week_number, t.order_index, r.resource_id`,[roadmapId]);

        //Group resources back under their topic
        const topicsMap = new Map<number, TopicResponse>();
        for(const row of joinResult.rows){
            if(!topicsMap.has(row.topic_id)){
                topicsMap.set(row.topic_id, {
                    topic_id: row.topic_id,
                    title: row.title,
                    description: row.description,
                    week_number: row.week_number,
                    order_index: row.order_index,
                    created_at: row.created_at,
                    resources: []
                })
            }
            if(row.resource_id){
                const topic = topicsMap.get(row.topic_id);
                if(topic){
                    topic.resources.push({
                        resource_id: row.resource_id,
                        topic_id: row.topic_id,
                        title: row.resource_title,
                        url: row.url,
                        type: row.type
                    })
                }
            }
        }
        const topics = Array.from(topicsMap.values());
        return { ...roadmap, topics }
}
    // //GET Topics
    // const topicsResult = await pool.query(
    //     'SELECT * FROM topics WHERE roadmap_id = $1 ORDER BY week_number, order_index',[roadmapId]
    // )
    
    // //GET resources for each topic
    // const topics = await Promise.all(
    //     topicsResult.rows.map(async (topic)=>{
    //         const resourcesResult = await pool.query(
    //             'SELECT * FROM resources WHERE topic_id = $1',[topic.topic_id]
    //         )
    //         return { ...topic, resources: resourcesResult.rows }
    //     })
    // )
    // return {...roadmap, topics}


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
        throw new AppError("Roadmap not found or unauthorized",404)
    }
}

