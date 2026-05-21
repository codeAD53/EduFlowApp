import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";


const ProtectedRoute = ({children}: {children: ReactNode }) => {
    const {isAuthenticated, isLoading} = useAuth();

    if(isLoading){
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading...</p>
            </div>
        )
    }

    if(!isAuthenticated){
        return <Navigate to='/login' replace />
    }
    return <>{children}</>
}

export default ProtectedRoute