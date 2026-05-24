import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { register as registerService } from '../services/auth.services'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'
import { Eye, EyeOff } from 'lucide-react'
import {motion} from 'framer-motion'

const initialFormState ={
    name: '',
    email: '',
    password: ''
}

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev=>({ ...prev, [e.target.name]: e.target.value }))
  }

  const passwordStrength = (password: string) => {
    if(password.length < 8) return 'Weak'
    if(password.length < 10) return 'Medium'
    return 'Strong'
  }

  const validationEmail = (email:string) =>{
    if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address'
  }
  const validatePassword = (password: string) => {
    if(password.length < 8) return 'Password must be at least 8 characters'
    if(!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter'
    if(!/\d/.test(password)) return 'Password must contain at least one number'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if(isLoading) return;
    
    const trimmedEmail = formData.email;
    if(!validationEmail(trimmedEmail)){
        toast.error(trimmedEmail)
    }
    const passwordError = validatePassword(formData.password)
    if(passwordError) {
      toast.error(passwordError)
      return
    }
    
    setIsLoading(true)

    try {
      const data = await registerService(
        trimmedEmail,
        formData.email.trim(),
        formData.password
      )
      login(data.token, data.user)
      toast.success(`Welcome to EduFlow, ${data.user.name}!`)
      navigate('/dashboard')
    } catch (error) {
        const err = error as AxiosError<{message: string}>
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setIsLoading(false)
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
          <p className="text-gray-400 mt-2">Start your learning journey</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete='name'
                placeholder="Aditya Kumar"
                disabled={isLoading}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                           text-white placeholder-gray-500 focus:outline-none
                           focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed
                           transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                id='email'
                type="email"
                name="email"
                value={formData.email}
                autoComplete='email'
                disabled={isLoading}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                           text-white placeholder-gray-500 focus:outline-none
                           focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed
                           transition"
              />
            </div>

            {/* Password */}
            <div>
                <div className='relative'>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Password
              </label>
              <input
                type= {showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete='current-password'
                placeholder="••••••••"
                required
                minLength={8}
                pattern="(?=.*[A-Z])(?=.*\d).*"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                           text-white placeholder-gray-500 focus:outline-none
                           focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                           transition"
              />
              <p className="text-gray-600 text-xs mt-1">
                Min 8 characters, one uppercase, one number
              </p>
              <p className='text-xs text-gray-400'>
                Strength: {passwordStrength(formData.password)}
              </p>

              <button type="button" onClick={()=>{
                setshowPassword(prev => !prev)
              } } aria-label={showPassword ? "Hide-Password" : "Show-Password"} className="absolute right-3 top-1/2 -translate-y-1/2
                             text-sm text-indigo-400 hover:text-indigo-300" >
                                {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                             </button>
            </div>
              </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800
                         disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg
                         transition mt-2"
            >
              {isLoading ? (
                <span className='flex items-center justify-center gap-2'>
                    <svg className='animate-spin h-5 w-5'  xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                        <circle className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4" />
                      <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                    </svg>
                    Creating account...
                </span>
              ) 
                 :  ( 'Create Account' )}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </motion.div>
  )
}

export default Register