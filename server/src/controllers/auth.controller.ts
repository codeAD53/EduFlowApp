import type { Request, Response } from "express";
import { RegisterUser, LoginUser } from "../services/auth.services.ts";


export const register = async (req:Request, res:Response, ):Promise<void> => {
        const result = await RegisterUser(req.body);
        res.status(201).json({
            success: true,
            data: result
        })
}

export const login = async (req:Request, res:Response,):Promise<void> => {
    
        const result = await LoginUser(req.body);
        res.status(200).json({ //200ok to keep API semantics correct (201 creates login resource)
            success: true,
            data: result
        });
};