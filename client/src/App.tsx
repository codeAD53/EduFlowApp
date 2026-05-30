import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoutes'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import RoadmapView from './pages/RoadmapView'
import NotFound from './pages/notFound'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Protected Routes */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path='/generate' element={
            <ProtectedRoute>
              <Generate />
            </ProtectedRoute>
          } />

          <Route path='/roadmap/:id' element={
            <ProtectedRoute>
              <RoadmapView />
            </ProtectedRoute>
          } />

          {/* Catch All - redirect to home */}
          <Route path='*' element={
            <NotFound />
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App