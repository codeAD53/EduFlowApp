import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import type { JWTPayload } from "../types/auth.types.ts";

// Extend Express Request type to include user
declare module "express-serve-static-core"{ //For Express Request Augmentation
    interface Request{
        user?: JWTPayload
    }
}

export const protect = (req:Request, res:Response, next:NextFunction) => {
    try {
        //GET token from header
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401).json({
                success: false,
                message: "No token provided, access denied"
            })
            return;
        }

        //Extract token (remove 'Bearer' prefix)
        const token = authHeader.split(' ')[1]
        if(!token){
             return res.status(401).json({
                    success: false,
                    message: "No token provided",
        });
        }

        //Verify token
        const jwtSecret = process.env.JWT_SECRET;
        if(!jwtSecret){
            throw new Error("JWT_SECRET is not configured");
        }
        const decoded = jwt.verify(token, jwtSecret) as JWTPayload; //jwt.verify(token, secret)

        //Attach user to request
        req.user = decoded
        next(); //move to next middleware or controller
    } catch {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        }) 
    }
}