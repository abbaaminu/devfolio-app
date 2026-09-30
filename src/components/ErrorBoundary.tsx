import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled application error', { error, componentStack: info.componentStack })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="min-h-screen flex items-center justify-center bg-dark-50 px-6 dark:bg-dark-950">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-2xl font-bold text-dark-900 dark:text-white">Something went wrong</h1>
          <p className="mb-6 text-dark-600 dark:text-dark-400">The page could not be rendered. Refresh to try again.</p>
          <button type="button" onClick={() => window.location.reload()} className="btn-primary">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
            Refresh page
          </button>
        </div>
      </main>
    )
  }
}
