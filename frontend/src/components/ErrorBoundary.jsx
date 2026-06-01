import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] bg-rose-50/50 border border-rose-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-md mx-auto my-12 font-sans select-none">
          <span className="text-4xl">⚠️</span>
          <h3 className="font-serif font-bold text-rose-900 text-lg">Something went wrong</h3>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
            An unexpected error occurred while loading this dashboard component. Please try reloading the page.
          </p>
          <div className="bg-rose-100/50 border border-rose-200 rounded-xl p-3 w-full text-left font-mono text-[10px] text-rose-700 overflow-x-auto max-h-32">
            {this.state.error?.message || String(this.state.error)}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
          >
            🔄 Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
