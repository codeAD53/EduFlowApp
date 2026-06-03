import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.ts";
import type{ RegisterInput, LoginInput, JWTPayload, AuthResponse } from "../types/auth.types.ts";
import { SALT_CONSTANTS } from "../constants/Salt_constants.ts";
import { AppError } from "../middlewares/error.middleware.ts";


//Shared helper - avoids duplicating the JWT sign logic in every auth flow

const signToken = (payload:JWTPayload):string => {
    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret) throw new Error("JWT_SECRET is not configured");
    const jwtExpiredIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, jwtSecret as jwt.Secret, {expiresIn: jwtExpiredIn }as jwt.SignOptions);
};

//Register
export const RegisterUser = async (input:RegisterInput):Promise<AuthResponse> => {
        const {name, email, password} = input;
        //Check if email already exist 
        const normalizedEmail = email.trim().toLowerCase();

        //Hash password
        const salt = await bcrypt.genSalt(SALT_CONSTANTS);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Insert User
        let result;
        try {
             result = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id, name, email',[name, normalizedEmail, hashedPassword]
             )
        } catch {
           throw new AppError("Email already exists",409);
        }

        const dbUser = result.rows[0];

        //Generate token
            const token = signToken({id: dbUser.user_id, email: dbUser.email});
            return {token, user:{
                id: dbUser.user_id,
                name: dbUser.name,
                email: dbUser.email
            }}
}

export const LoginUser = async (input:LoginInput):Promise<AuthResponse> => {
    const {email,password} = input;
    
    //Check user exists
    const normalizedEmail = email.trim().toLowerCase();

         const result = await pool.query(
        'SELECT user_id, name, email, password FROM users WHERE email= $1',[normalizedEmail]
    )       
        
    if(result.rows.length === 0){
        throw new AppError('Invalid email or password',401);
    }
    const dbUser = result.rows[0];

    //Compare Password
    const isMatch = await bcrypt.compare(password,dbUser.password);
    if(!isMatch){
        throw new AppError("Invalid email or password",401);
    }

    //Generate Token
    const token = signToken({id: dbUser.user_id, email: dbUser.email});

    return {token,
        user: {
            id: dbUser.user_id,
            name: dbUser.name,
            email: dbUser.email
        }
    }
}