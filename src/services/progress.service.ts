import pool from "../db/index.ts";
import type { UpdateProgressInput, RoadmapProgress, ProgressResponse } from "../types/progess.types.ts";

//Update or insert progress (UPSERT)
export const updateProgress = async (userId: number, 
    input: UpdateProgressInput
):Promise<ProgressResponse> => {
    const {topic_id, status} = input;

    const client = await pool.connect();
    //Verify topic exists
    try {
        await client.query('BEGIN');
        const existTopic = await client.query(
            'SELECT * FROM topics WHERE topic_id = $1', [topic_id]
        );
        if (existTopic.rows.length === 0) {
            throw new Error('Topic not found');
        }

        //UPSERT - insert if not exists, update if exists
        const result = await client.query(
            `INSERT INTO user_progress (user_id,topic_id,status,updated_at) VALUES ($1, $2, $3, NOW())
            ON CONFLICT(user_id, topic_id)
            DO UPDATE SET
                status = EXCLUDED.status,
                updated_at = NOW()
            RETURNING *`, [userId, topic_id, status]
        );

        await client.query('COMMIT');
        return result.rows[0];
    } catch (error) {
       client.query('ROLLBACK');
       throw error;
    } 
    finally {
        client.release();
    }
    }

//Get full roadmap progress for a specific roadmap
export const getRoadmapProgress = async (userId: number, roadmapId: number): Promise<RoadmapProgress> => {
    //Verify roadmap belongs to user
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const verifyRoadmap = await client.query(
            `SELECT roadmap_id, title FROM roadmaps WHERE roadmapid = $1 AND user_id= $2`,[roadmapId, userId]
        )
        if(verifyRoadmap.rows.length === 0){
            throw new Error("Roadmap not found")
        }
        const roadmapResult = verifyRoadmap.rows[0];

        //GET all topics with their progress status

        const result = await client.query(
            `SELECT t.topic_id, t.title, t.week_number, t.order_index, COALESCE(up.status, 'not_started') AS status FROM topics t LEFT JOIN user_progress up ON up.topic_id = t.topic_id AND up.user_id = $1 WHERE t.roadmap_id=$2 ORDER BY t.week_number, t.order_index`,[userId, roadmapId]
        )
        const topics = result.rows;
        const total_topics = topics.length;
        const completed_topics = topics.filter((t)=> t.status === 'completed').length;
        const completion_percentage = total_topics === 0 ? 0 : Math.round((completed_topics / total_topics) * 100)

        await client.query(`COMMIT`);
        return {
            roadmap_id: roadmapResult.roadmap_id,
            title: roadmapResult.title,
            total_topics,
            completed_topics,
            completion_percentage,
            topics
        }
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
}

