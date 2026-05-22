import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const {isAuthenticated = false, isLoading = false} = useAuth() as { isAuthenticated?: boolean; isLoading?: boolean };

    if(isLoading){
        return(
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading...</p>
            </div>
        )
    }
    if(!isAuthenticated){
        return <Navigate to= '/login' replace/>
    }
    return <>{children}</>
}

export default ProtectedRoute