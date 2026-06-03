import type { NextFunction, Request, Response } from "express";
import { generateAndSaveRoadmap, getRoadmapById, getUserRoadmaps, deleteRoadmap} from "../services/roadmap.service.ts";


//POST /api/roadmap/generate
export const generateRoadmap = async (req:Request, res:Response, next:NextFunction):Promise<void> => {

    try {
        const userId = req.user!.id;
        const roadmap = await generateAndSaveRoadmap(userId, req.body);
        res.status(201).json({success: true, data:roadmap});
    } catch (error:unknown) {
        console.error('GENERATE ERROR:', error)
        next(error)
    }
}

//GET /api/roadmap
export const getRoadmaps = async (req:Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const roadmaps = await getUserRoadmaps(userId);
        res.status(200).json({success: true, data: roadmaps});
    } catch (error:unknown) {
         next(error);
    }
}

//GET ROADMAP BY ID
export const getRoadmap = async (req:Request, res:Response, next:NextFunction) => {
    try{

        const userId = req.user!.id;
        const roadmapId = parseInt(String(req.params.id), 10);
        if(Number.isNaN(roadmapId)){
            res.status(400).json({success: false, message: "Invalid roadmap id"})
            return;
        }
        const roadmap = await getRoadmapById(roadmapId, userId)
        res.status(200).json({ success: true, data: roadmap })
    }
    catch (error:unknown) {
        next(error)
    }
}

//DELETE /api/roadmap/:id
export const removeRoadmap = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const userId = req.user!.id;
        const roadmapId = parseInt(String(req.params.id), 10);
        if(Number.isNaN(roadmapId)){
             res.status(400).json({
             success:false,
            message:"Invalid roadmap id"
        });
        return;
        }
        await deleteRoadmap(roadmapId, userId)
        res.status(200).json({ success: true, message: 'Roadmap deleted successfully' })

    } catch (error:unknown) {
         next(error)
    }
}