import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <h2 className="font-bold mb-2">Une erreur est survenue</h2>
          <p className="text-sm font-mono">{this.state.error?.toString()}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
