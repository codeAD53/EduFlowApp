import { Router } from "express";
import {generate, getOne, getAll, removeRoadmap} from '../controllers/roadmap.controller.ts'
import { protect } from "../middlewares/auth.middleware.ts";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware.ts";

const router = Router();
//All routers are protected
router.use(protect);

const generateRules = [
    body('title').trim().notEmpty().withMessage("Title is required"),
    body('goal').trim().notEmpty().withMessage('Goal is required'),
    body('level').isIn(["beginner", "intermediate", "advanced"]).notEmpty().withMessage('Level must be beginner, intermediate and advanced'),
    body('duration').trim().notEmpty().withMessage("Duration is required"),
]

router.post('/generate',generate, validate, generateRules);
router.get('/',getAll);
router.get('/:id',getOne);
router.delete('/:id',removeRoadmap);

export default router

