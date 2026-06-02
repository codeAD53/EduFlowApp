import React, {useEffect, useState} from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import {login as loginService} from '../services/auth.services'
import type { AxiosError } from "axios";
import { Eye, EyeOff, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import {motion} from 'framer-motion'
import { STORAGE_KEYS } from "../constants/StorageKEYS";

const Login = () => {
const navigate = useNavigate();
const location = useLocation();
const { isAuthenticated, login } = useAuth();

//lazy initializer - reads localStorage at mount time, not at module load time
const [formData, setFormData] = useState(()=>({
    email: localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) || '',
    password: ''
}))
const [isLoading, setIsLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(()=>(Boolean(localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)))); //Boolean(null) -> false

useEffect(()=>{ //Redirect if already logged in
    if(isAuthenticated) navigate('/dashboard')
},[isAuthenticated, navigate])

const validationEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
        ...prev, [e.target.name]: e.target.value
    }))
}

const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault();
    if(isLoading) return;
    
    const trimmedEmail = formData.email.trim();
    if(!validationEmail(trimmedEmail)){
        toast.error('Please enter a valid email address');
        return;
    }
    
    setIsLoading(true);

    try{
        const data = await loginService(trimmedEmail, formData.password);
        login(data.token,data.user)

        if(rememberMe){
            localStorage.setItem(STORAGE_KEYS.REMEMBER_ME,trimmedEmail)
        }else{
            localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME)
        }

        toast.success(`Welcome back, ${data.user.name}!`);

        //redirect back to where the user was trying to go, or dashboard
        const from = (location.state as {from?: string})?.from || 'dashboard';
        navigate(from);
    }catch(error){
        const err = error as AxiosError<{message: string}>
        toast.error(err.response?.data?.message || 'Login Failed. Please check your credentials.')
    }finally{
        setIsLoading(false);
    }
}


return (
<motion.div initial={{ opacity: 0, y: 20 }} 
animate={{opacity: 1, y:0}}
transition={{duration: 0.4}} className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">EduFlow</h1>
            <p className="text-gray-400 mt-2">Welcome Back</p>
            </div>

            {/* Login Card */}
            <div className="backdrop-blur-xl
bg-white/5
border border-white/10
shadow-2xl
rounded-2xl
p-8">
            <h2 className="text-xl font-semibold text-white mb-6">Sign in to your account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}

                <div> 
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-400 mb-1 ">Email</label>
                    <input id="email" type="email" name="email" autoComplete="email" disabled={isLoading} value={formData.email} onChange={handleChange} placeholder="you@example.com" required 
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed transition"
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                    <div className="relative">
                    <input id='password' type={showPassword ? 'text' : "password" }name="password" value={formData.password} disabled={isLoading} onChange={handleChange}
                    autoComplete="current-password"
                    placeholder="••••••••" minLength={8}
                    className="w-full bg-gray-800 border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" required
                    />

                <button type="button"
                aria-label={showPassword ? 'Hide-Password':'Show-Password'} onClick={()=>{
                   setShowPassword(prev => !prev)
                }} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-400 hover:text-indigo-300">
                    {showPassword ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
                </button>
                </div>
                </div>



                {/* Forgot Password */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                        <input type="checkbox" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)} className="rounded"/>
                        Remember Me
                    </label>

                    <Link to='/forgot-password' className="text-sm text-indigo-400 hover:text-indigo-300">Forgot Password?</Link>
                </div>


                {/* Submit */}
                <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition mt-2">
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns='http://www.w3.org/2000/svg' fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            Signing in.... </span>
                    ) : (
                        'Sign in'
                    )}
                </button>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>

                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-900 px-3 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition">
                        <Mail size={18} />Google
                    </button>

                    <button type="button" className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition">
                        <FaGithub size={18} />GitHub
                    </button>
                </div>
            </div>

            {/* Footer */}

            <p className="text-center text-gray-500 text-sm mt-6">Don't have an account?{' '}
                <Link to='/register' className="text-indigo-400 hover:text-indigo-300 font-medium">
                Sign up</Link>
            </p>
        </div>
    </div>
</motion.div>
)    
}
export default Login