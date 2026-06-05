import type { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.services.ts";


export const register = async (req:Request, res:Response):Promise<void> => {
        const result = await registerUser(req.body);
        res.status(201).json({
            success: true,
            data: result
        })
}

export const login = async (req:Request, res:Response):Promise<void> => {
    
        const result = await loginUser(req.body);
        res.status(200).json({ //200ok to keep API semantics correct (201 creates login resource)
            success: true,
            data: result
        });
};