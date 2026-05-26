import type { Request, Response } from "express";

import { AppError } from "../middlewares/error.middleware.ts";
import { generateAndSaveRoadmap, getRoadmapById, getUserRoadmaps, deleteRoadmap} from "../services/roadmap.service.ts";

const getErrorStatus = (error: unknown): number => {
    if (error instanceof AppError) return error.statusCode;
    if (error instanceof Error) {
        if (error.name === "NotFoundError") return 404;
        if (error.name === "ValidationError" || error.name === "BadRequestError") return 400;
    }
    return 500;
};

//POST /api/roadmap/generate
export const generate = async (req:Request, res:Response):Promise<void> => {

    try {
        const userId = req.user!.id;
        const roadmap = await generateAndSaveRoadmap(userId, req.body);
        res.status(201).json({success: true, data:roadmap});
    } catch (error:unknown) {
        console.error('GENERATE ERROR:', error)
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : String(error)});
    }
}

//GET /api/roadmap
export const getAll = async (req:Request, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const roadmaps = await getUserRoadmaps(userId);
        res.status(200).json({success: true, data: roadmaps});
    } catch (error:unknown) {
         res.status(500).json({ success: false, message: error instanceof Error ? error.message : String(error)});
    }
}

//GET ROADMAP BY ID
export const getOne = async (req:Request, res:Response) => {
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
         const status = getErrorStatus(error);
         res.status(status).json({ success: false, message: error instanceof Error ? error.message : String(error)});
    }
}

//DELETE /api/roadmap/:id
export const removeRoadmap = async (req: Request, res:Response) => {
    try {
        const userId = req.user!.id;
        const roadmapId = parseInt(String(req.params.id), 10);
        await deleteRoadmap(roadmapId, userId)
        res.status(200).json({ success: true, message: 'Roadmap deleted successfully' })

    } catch (error:unknown) {
         const status = getErrorStatus(error);
         res.status(status).json({ success: false, message: error instanceof Error ? error.message : String(error)});
    }
}