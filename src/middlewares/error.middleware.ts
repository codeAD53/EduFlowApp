import type { Request, Response, NextFunction } from "express";

export class AppError extends Error{
            statusCode: number
            isOperational: boolean

            constructor(message: string, statusCode: number){
                super(message);
                this.statusCode = statusCode;
                this.isOperational = true;
                Error.captureStackTrace(this, this.constructor)
            }
}

type ErrorWithStatus = {
    statusCode?: number
    message?: string
    name?: string
    isOperational?: boolean
    stack?: string
    code?: string
}

export const notFound = (req:Request, res:Response, next:NextFunction) => {
        next(new AppError(`Route ${req.originalUrl} not found`,404))
}

export const globalHandler = (
    err: unknown,
    req:Request,
    res:Response, 
    next: NextFunction
) => {
    const error: ErrorWithStatus = typeof err === 'object' && err !== null ? (err as ErrorWithStatus) : {message: String(err)};
    error.statusCode = error.statusCode || 500
    error.message = error.message || 'Internal Server Error'

    //PostgreSql uniqueness constraint violation (e.g.duplicate email)
    if(typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as {code?: string}).code === '23505'
    ){
        return res.status(409).json({
            success: false,
            message: 'A record with that value already exists'
        })
    }

    //PostgreSql foreign Key violations
    if(
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as {code?: string}).code === '23503'
    ){
        return res.status(400).json({
            success: false,
            message: 'Referenced record does not exist'
        })
    }

    //JWT errors
    if(error.name === 'JsonWebTokenError'){
        return res.status(401).json({success: false, message: 'Invalid token'})
    }

    if(error.name === 'TokenExpiredError'){
        return res.status(401).json({success: false, message: 'Token expired'})
    }

    //Our own AppError
    if(error.isOperational){
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        })
    }

    //Unknown errors
    console.error('UNEXPECTED_ERROR:',err)
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
        ? 'Something went strong' : error.message,
        ...(process.env.NODE_ENV !== 'production' && {stack: error.stack})
    })
}
