import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import NotFound from './pages/NotFound'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/auth" replace />
}

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 transition-colors duration-300">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/:username" element={<Portfolio />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
