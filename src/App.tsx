import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useI18n } from './lib/i18n'

const Home = lazy(() => import('./pages/Home'))
const Auth = lazy(() => import('./pages/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950" role="status" aria-label="Loading page">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-dark-200 border-t-primary-600 dark:border-dark-700" />
    </div>
  )
}

function ConnectionStatus() {
  const { t } = useI18n()
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (online) return null
  return <div className="fixed inset-x-0 bottom-0 z-[60] bg-dark-900 px-4 py-3 text-center text-sm text-white" role="status">{t('offline')}</div>
}

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
      <a href="#main-content" className="skip-link">{useI18n().t('skipToContent')}</a>
      <ConnectionStatus />
      <Suspense fallback={<PageFallback />}>
        <div id="main-content" tabIndex={-1}>
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
      </Suspense>
    </div>
  )
}

export default App
