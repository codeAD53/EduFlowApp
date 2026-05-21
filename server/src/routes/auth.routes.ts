import { Router } from "express";
import { register, login } from "../controllers/auth.controller.ts"; 
import { registerRules, loginRules,validate } from "../middlewares/validate.middleware.ts";

const router = Router();

router.post('/register',registerRules, validate, register);
router.post('/login',loginRules, validate, login);

export default router