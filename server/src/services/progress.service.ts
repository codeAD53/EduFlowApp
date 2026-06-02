import pool from "../db/index.ts";
import { AppError } from "../middlewares/error.middleware.ts";
import type { UpdateProgressInput, RoadmapProgress, ProgressResponse } from "../types/progress.types.ts";

//Update or insert progress (UPSERT)
export const updateProgress = async (userId: number, 
    input: UpdateProgressInput
):Promise<ProgressResponse> => {
    const {topic_id, status} = input;

    const client = await pool.connect();
    //Verify topic exists
    try {
        await client.query('BEGIN');

        //Prevents users from marking topics in other user's roadmaps
        const existTopic = await client.query(
            `SELECT t.topic_id FROM topics t JOIN roadmaps r ON t.roadmap_id = r.roadmap_id WHERE t.topic_id = $1 AND r.user_id = $2`,[topic_id, userId]
        );
        if (existTopic.rows.length === 0) {
            throw new AppError('Topic not found',404);
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
       await client.query('ROLLBACK');
       throw error;
    } 
    finally {
        client.release();
    }
    }

//Get full roadmap progress for a specific roadmap
export const getRoadmapProgress = async (userId: number, roadmapId: number): Promise<RoadmapProgress> => {
    //Verify roadmap belongs to user
        
        const verifyRoadmap = await pool.query(
            `SELECT roadmap_id, title FROM roadmaps WHERE roadmap_id = $1 AND user_id= $2`,[roadmapId, userId]
        )
        if(verifyRoadmap.rows.length === 0){
            throw new AppError("Roadmap not found",404)
        }
        const roadmapResult = verifyRoadmap.rows[0];

        //GET all topics with their progress status

        const result = await pool.query(
            `SELECT t.topic_id, t.title, t.week_number, t.order_index, COALESCE(up.status, 'not_started') AS status FROM topics t LEFT JOIN user_progress up ON up.topic_id = t.topic_id AND up.user_id = $1 WHERE t.roadmap_id=$2 ORDER BY t.week_number, t.order_index`,[userId, roadmapId]
        )
        const topics = result.rows;
        const total_topics = topics.length;
        const completed_topics = topics.filter((t)=> t.status === 'completed').length;
        const completion_percentage = total_topics === 0 ? 0 : Math.round((completed_topics / total_topics) * 100)

        
        return {
            roadmap_id: roadmapResult.roadmap_id,
            title: roadmapResult.title,
            total_topics,
            completed_topics,
            completion_percentage,
            topics
        }
    
}

