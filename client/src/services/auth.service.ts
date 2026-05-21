import type { AuthResponse } from "../types";
import api from "./api";

export const registerUser = async (name: string, email: string, password: string):Promise<AuthResponse> => {

    const res = await api.post('/auth/register',{name,email,password})
    return res.data.data;
}

export const loginUser = async (email: string, password: string):Promise<AuthResponse> => {

    const res = await api.post('/auth/login',({email, password}))
    return res.data.data
}
