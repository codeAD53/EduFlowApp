import { Router } from "express";
import {generateRoadmap, getRoadmap, getRoadmaps, removeRoadmap} from '../controllers/roadmap.controller.ts'
import { protect } from "../middlewares/auth.middleware.ts";
import { body } from "express-validator";

import { validate } from "../middlewares/validate.middleware.ts";
import { IdParamRule } from "../validator/id.validator.ts";
import rateLimit from "express-rate-limit";

const router = Router();
//All routers are protected
router.use(protect);

const generateRules = [
    body('title').trim().notEmpty().withMessage("Title is required").isLength({max: 120}).withMessage("Title must be 120 characters"),
    body('goal').trim().notEmpty().withMessage('Goal is required').isLength({max:500}).withMessage('Goal must be 500 characters'),
    body('level').notEmpty().withMessage("Level is required").isIn(["beginner", "intermediate", "advanced"]).withMessage('Level must be beginner, intermediate and advanced'),
    body('duration').trim().notEmpty().withMessage("Duration is required").isLength({max:60}).withMessage('Duration must be 60 characters'),
]

const aiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 5,
    message: {success: false, message: "Too many request. Please try again some time"},
    standardHeaders: true,
    legacyHeaders: false,
})
router.post('/generate', generateRules, validate, aiLimiter, generateRoadmap);
router.get('/', getRoadmaps);
router.get('/:id',IdParamRule, getRoadmap);
router.delete('/:id',IdParamRule, removeRoadmap);

export default router

