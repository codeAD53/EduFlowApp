import type { Request, Response } from "express";
import { generateAndSaveRoadmap, getRoadmapById, getUserRoadmaps, deleteRoadmap} from "../services/roadmap.service.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";


//POST /api/roadmap/generate
export const generateRoadmap = asyncHandler(
    async (req:Request, res:Response):Promise<void> => {
        const userId = req.user!.id;
        const roadmap = await generateAndSaveRoadmap(userId, req.body);
        res.status(201).json({success: true, data:roadmap});
    } 
);

//GET /api/roadmap
export const getRoadmaps = asyncHandler(
    async (req:Request, res: Response): Promise<void> => {
        const userId = req.user!.id;
        const roadmaps = await getUserRoadmaps(userId);
        res.status(200).json({success: true, data: roadmaps});
}
); 

//GET ROADMAP BY ID
export const getRoadmap =  asyncHandler (
    async (req:Request, res:Response) => {
        const userId = req.user!.id;
        const roadmapId = parseInt(String(req.params.id), 10);
        if(Number.isNaN(roadmapId)){
            res.status(400).json({success: false, message: "Invalid roadmap id"})
            return;
        }
        const roadmap = await getRoadmapById(roadmapId, userId)
        res.status(200).json({ success: true, data: roadmap })
}

);

//DELETE /api/roadmap/:id
export const removeRoadmap = asyncHandler(
    async (req: Request, res:Response):Promise<void> => {
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

    
}
);