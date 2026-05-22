import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

interface AuthContextTypes {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextTypes | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<User | null>(()=>{
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null //This is called lazy initialization — you pass a function to useState that runs once on mount and reads localStorage directly. No useEffect, no cascading renders.
    });
    const [token, setToken] = useState<string | null>(()=>{
        return localStorage.getItem('token')
        
    });
    const [isLoading] = useState(false);

    const login = (token: string, user: User) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setToken(token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }
    return(
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!false,
            isLoading,
            login,
            logout
        }}>{children}</AuthContext.Provider>
    )
}

export {AuthContext}


