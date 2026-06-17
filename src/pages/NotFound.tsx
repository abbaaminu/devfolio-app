import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-50 dark:bg-dark-950 px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-3">
          Page not found
        </h1>
        <p className="text-dark-600 dark:text-dark-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}
