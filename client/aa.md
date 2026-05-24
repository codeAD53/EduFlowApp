import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useAuth } from '../hooks/useAuth'
import { login as loginService } from '../services/auth.services'
import toast from 'react-hot-toast'

const initialFormState = {
  email: '',
  password: '',
}

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState(initialFormState)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)

    try {
      const data = await loginService(
        formData.email.trim(),
        formData.password
      )

      login(data.token, data.user)

      toast.success(`Welcome back, ${data.user.name}!`)

      navigate('/dashboard')
    } catch (error) {
      const err = error as AxiosError<{ message: string }>

      toast.error(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            EduFlow
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome back
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                disabled={isLoading}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3
                           text-white placeholder-gray-500
                           focus:outline-none focus:border-indigo-500
                           focus:ring-1 focus:ring-indigo-500
                           disabled:opacity-60 disabled:cursor-not-allowed
                           transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pr-16
                             text-white placeholder-gray-500
                             focus:outline-none focus:border-indigo-500
                             focus:ring-1 focus:ring-indigo-500
                             disabled:opacity-60 disabled:cursor-not-allowed
                             transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-sm text-indigo-400 hover:text-indigo-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700
                         disabled:bg-indigo-800
                         disabled:cursor-not-allowed
                         text-white font-semibold py-3 rounded-lg
                         focus:outline-none focus:ring-2
                         focus:ring-indigo-500
                         transition"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login