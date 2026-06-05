import { Router } from "express";
import { register, login } from "../controllers/auth.controller.ts"; 
import { registerRules, loginRules,validate } from "../middlewares/validate.middleware.ts";
import { asyncHandler } from "../middlewares/asyncHandler.ts";

const router = Router();

router.post('/register',registerRules, validate, register);
router.post('/login',loginRules, validate, asyncHandler(login));

export default router