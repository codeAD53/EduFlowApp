import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.ts";
import type{ RegisterInput, LoginInput, JWTPayload, AuthResponse } from "../types/auth.types.ts";

//Register
export const RegisterUser = async (input:RegisterInput):Promise<AuthResponse> => {
        const {name, email, password} = input;
        //Check if email already exist 
        const normalizedEmail = email.trim().toLowerCase();

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Insert User
        let result;
        try {
             result = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id, name, email',[name, normalizedEmail, hashedPassword]
             )
        } catch (error:unknown) {
            if(
                typeof error === 'object' &&
                error !== null &&
                "code" in error &&
                (error as {code?: string}).code === '23505'
            ) {
                const duplicateEmailError = new Error("Email already exists");
                (duplicateEmailError as Error & { cause?: unknown }).cause = error;
                throw duplicateEmailError;
            }
            throw error;
        }

        const dbUser = result.rows[0];

        //GENERATE TOKEN
        const payload: JWTPayload = { id: dbUser.user_id, email: dbUser.email }

        const jwtSecret = process.env.JWT_SECRET;
        if(!jwtSecret){
            throw new Error("JWT_SECRET is not configured");
        }
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
        const token = jwt.sign(payload, jwtSecret as jwt.Secret, 
            { expiresIn: jwtExpiresIn} as jwt.SignOptions )

            return {token, user:{
                id: dbUser.user_id,
                name: dbUser.name,
                email: dbUser
            }}
}

export const LoginUser = async (input:LoginInput):Promise<AuthResponse> => {
    const {email,password} = input;
    
    //Check user exists
    const normalizedEmail = email.trim().toLowerCase();

         const result = await pool.query(
        'SELECT * FROM users WHERE email= $1',[normalizedEmail]
    )       
        
    if(result.rows.length === 0){
        throw new Error('Invalid email or password')
    }
    const dbUser = result.rows[0];

    //Compare Password
    const isMatch = await bcrypt.compare(password,dbUser.password);
    if(!isMatch){
        throw new Error("Invalid email or password");
    }

    //Generate Token
    const payload: JWTPayload = { id: dbUser.user_id, email: dbUser.email };

    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
        throw new Error("JWT_SECRET is not configured");
    }
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
    const token = jwt.sign(payload, jwtSecret as jwt.Secret, {
        expiresIn: jwtExpiresIn  } as jwt.SignOptions 
    )

    return {token,
        user: {
            id: dbUser.user_id,
            name: dbUser.name,
            email: dbUser.email
        }
    }
}