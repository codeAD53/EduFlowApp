import { v4 as uuidv4 } from "uuid"
import type {Request, Response, NextFunction} from "express";

export const requestId = (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    req.requestId = uuidv4();
    next();
}

