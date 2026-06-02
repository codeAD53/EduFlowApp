import { Router } from "express";
import {generateRoadmap, getRoadmap, getRoadmaps, removeRoadmap} from '../controllers/roadmap.controller.ts'
import { protect } from "../middlewares/auth.middleware.ts";
import { body } from "express-validator";

import { validate } from "../middlewares/validate.middleware.ts";
import { IdParamRule } from "../validator/id.validator.ts";

const router = Router();
//All routers are protected
router.use(protect);

const generateRules = [
    body('title').trim().notEmpty().withMessage("Title is required"),
    body('goal').trim().notEmpty().withMessage('Goal is required'),
    body('level').notEmpty().withMessage("Level is required").isIn(["beginner", "intermediate", "advanced"]).withMessage('Level must be beginner, intermediate and advanced'),
    body('duration').trim().notEmpty().withMessage("Duration is required"),
]

router.post('/generate', generateRules, validate, generateRoadmap);
router.get('/', getRoadmaps);
router.get('/:id',IdParamRule, getRoadmap);
router.delete('/:id',IdParamRule, removeRoadmap);

export default router

