import type { Request, Response } from "express";

import { generateAndSaveRoadmap, getRoadmapById, getUserRoadmaps, deleteRoadmap} from "../services/roadmap.service.ts";

//POST /api/roadmap/generate
export const generate = async (req:Request, res:Response):Promise<void> => {

    try {
        const userId = req.user!.id;
        const roadmap = await generateAndSaveRoadmap(userId, req.body);
        res.status(201).json({success: true, data:roadmap});
    } catch (error:unknown) {
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
        const roadmap = await getRoadmapById(userId, roadmapId)
        res.status(200).json({ success: true, data: roadmap })
    }
    catch (error:unknown) {
         res.status(404).json({ success: false, message: error instanceof Error ? error.message : String(error)});
    }
}

//DELETE /api/roadmap/:id
export const removeRoadmap = async (req: Request, res:Response) => {
    try {
        const userId = req.user!.id;
        const roadmapId = parseInt(String(req.params.id), 10);
        await deleteRoadmap(userId, roadmapId)
        res.status(200).json({ success: true, message: 'Roadmap deleted successfully' })

    } catch (error:unknown) {
         res.status(404).json({ success: false, message: error instanceof Error ? error.message : String(error)});
    }
}