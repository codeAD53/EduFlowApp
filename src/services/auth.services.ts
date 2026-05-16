import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/index.ts";
import type{ RegisterInput, LoginInput, JWTPayload, AuthResponse } from "../types/auth.types.ts";

//Register
export const RegisterUser = async (input:RegisterInput):Promise<AuthResponse> => {
        const {name, email, password} = input;
        //Check if email already exist 
        const isExist = await pool.query(
                'SELECT user_id FROM users WHERE email = $1',
                [email]
        )
        if(isExist.rows.length > 0){
            throw new Error(`${email} Email already exists`);
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Insert User
        const result = await pool.query(
            'INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING user_id,name,email',
            [name, email, hashedPassword]
        )

        const user = result.rows[0];

        //GENERATE TOKEN
        const payload: JWTPayload = { id: user.user_id, email: user.email }
        const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d '} as jwt.SignOptions )

            return {token, user}
}

export const LoginUser = async (input:LoginInput):Promise<AuthResponse> => {
    const {email,password} = input;
    
    //Check user exists
    const result = await pool.query(
        'SELECT * FROM users WHERE email= $1',[email]
    )
    if(result.rows.length === 0){
        throw new Error('Invalid email or password')
    }
    const user = result.rows[0];

    //Compare Password
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error("Invalid email or password");
    }

    //Generate Token
    const payload: JWTPayload = { id: user.user_id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as jwt.Secret, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'  } as jwt.SignOptions 
    )

    return {token,
        user: {
            id: user.user_id,
            name: user.name,
            email: user.email
        }
    }
}