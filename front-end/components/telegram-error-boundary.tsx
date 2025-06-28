"use client"

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class TelegramErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Telegram WebApp Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-6">
            <div className="text-red-500 text-xl mb-2">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Telegram Web App xatoligi
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Ilova normal browser muhitida ishlaydi
            </p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Qaytadan urinish
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default TelegramErrorBoundary 