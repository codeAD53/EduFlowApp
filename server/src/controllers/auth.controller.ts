import type { Request, Response } from "express";
import { RegisterUser, LoginUser } from "../services/auth.services.ts";


export const register = async (req:Request, res:Response):Promise<void> => {
    try {
        const result = await RegisterUser(req.body);
        res.status(201).json({
            success: true,
            data: result
        })
    } catch (error:unknown) { //return santized messages and map unexpected errors to 500
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        const status = message === "Internal Server Error" ? 500 : 400;
        res.status(status).json({
            success: false,
            message
        })
    }
}

export const login = async (req:Request, res:Response):Promise<void> => {
    try {
        const result = await LoginUser(req.body);
        res.status(200).json({ //200ok to keep API semantics correct (201 creates login resource)
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