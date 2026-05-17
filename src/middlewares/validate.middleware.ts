import { body, validationResult, type ValidationError } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res:Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            success: false,
            message: 'Validation Failed',
            errors: errors.array().map((e:ValidationError)=>({
                field: e.type === 'field' ? e.path : 'unknown', message: e.msg
            }))
        })
        return;
    }
    next();
}

export const registerRules = [
    body('name')
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({min:2,max:50}).withMessage("Name must be between 2 and 50 characters"),

    body('email')
        .trim()
        .toLowerCase()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail(),
    
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({min:8}).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage("Password must contain at least one number"),
]

export const loginRules = [
    body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email address")
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),
]