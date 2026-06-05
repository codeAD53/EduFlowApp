import type { Request, Response } from "express";
import { updateProgress, getRoadmapProgress } from "../services/progress.service.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";

//PATCH /api/progress
export const update = asyncHandler (

    async (req:Request, res:Response):Promise<void> => {
    
            const user_id =  req.user!.id;
            const progress = await updateProgress(user_id, req.body);
            res.status(200).json({success: true, data: progress});
    }
);

//GET /api/progress/:roadmapId
export const getRoadmap = asyncHandler (

    async (req:Request, res:Response):Promise<void> => {
           const userId = req.user!.id;
           const roadmap_id = parseInt(String(req.params.roadmapId),10);
           if(Number.isNaN(roadmap_id)){
                res.status(400).json({success: false, message: "Invalid roadmap id"})
                   return;
           }
           const progress = await getRoadmapProgress(userId, roadmap_id);
           res.status(200).json({success: true, data: progress})
   }
);