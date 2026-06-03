import { Router } from "express";
import { update, getRoadmap } from "../controllers/progress.controller.ts";
import { protect } from "../middlewares/auth.middleware.ts";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware.ts";
import { idParamRule } from "../validator/id.validator.ts";

const router = Router();
router.use(protect);


const protectRules = [
    body('topic_id')
        .notEmpty().withMessage('Topic ID is required')
        .isInt({min:1}).withMessage('Topic ID must be a positive number').toInt(),

    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['not_started', 'in_progress', 'completed'])
        .withMessage("Status must be not_started, in_progress, completed"),
]

router.patch('/',protectRules, validate, update);
router.get('/:roadmapId',idParamRule('roadmapId'),validate, getRoadmap);

export default router