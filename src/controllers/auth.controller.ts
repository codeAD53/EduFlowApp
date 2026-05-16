import type { Request, Response } from "express";
import { RegisterUser, LoginUser } from "../services/auth.services.ts";


export const register = async (req:Request, res:Response):Promise<void> => {
    try {
        const result = await RegisterUser(req.body);
        res.status(201).json({
            success: true,
            data: result
        })
    } catch (error:any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const login = async (req:Request, res:Response):Promise<void> => {
    try {
        const result = await LoginUser(req.body);
        res.status(201).json({
            success: true,
            data: result
        })
    } catch (error:any) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}