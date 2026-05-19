import type { Request, Response } from "express";
import { updateProgress, getRoadmapProgress } from "../services/progress.service.ts";

//PATCH /api/progress
export const update = async (req:Request, res:Response):Promise<void> => {

    try {
        const user_id =  req.user!.id;
        const progress = await updateProgress(user_id, req.body);
    
        res.status(200).json({success: true, data: progress});
        
    } catch (error:unknown) {
        res.status(500).json({success: false, message: error instanceof Error ? error.message : String(error)})
        return;
    }    
}

//GET /api/progress/:roadmapId
export const getRoadmap = async (req:Request, res:Response) => {
    try {
        
        const userId = req.user!.id;
        const roadmap_id = parseInt(String(req.params.id),10);
        if(Number.isNaN(roadmap_id)){
             res.status(400).json({success: false, message: "Invalid roadmap id"})
                return;
        }

        const progress = await getRoadmapProgress(userId, roadmap_id);
        res.status(200).json({success: true, data: progress})

    } catch (error:unknown) {
        res.status(500).json({success: false, message: error instanceof Error ? error.message : String(error)});
        return;
    }
}