import { createContext, useContext, useState, useEffect, } from 'react'
import type { ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (token: string, user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user')

    if(savedToken && savedUser){
        setToken(savedToken);
        setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
}, [])

const login = (token: string, user: User) => {
    localStorage.setItem('token',token)
    localStorage.setItem('user',JSON.stringify(user))
    setToken(token);
    setUser(user)
}

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user')
    setToken(null);
    setUser(null);
}

return (
    <AuthContext.Provider value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout
    }}>{children}</AuthContext.Provider>
)
}

//Custom hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used inside AuthProvider')
    }
    return context
}