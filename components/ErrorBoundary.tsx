"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details but don't crash
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Optional: Send error to monitoring service
    try {
      // You can add error reporting here
      // Example: Sentry.captureException(error);
    } catch {
      // Even error reporting shouldn't crash the app
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-serif mb-4 text-[var(--text)]">
              Something went wrong
            </h1>
            <p className="text-[var(--text)]/70 mb-6">
              We encountered an unexpected error. Please refresh the page to continue.
            </p>
            <button
              onClick={() => {
                try {
                  // Reset error state
                  this.setState({ hasError: false, error: undefined });
                  // Try to reload the page
                  window.location.reload();
                } catch {
                  // If reload fails, just reset state
                  this.setState({ hasError: false, error: undefined });
                }
              }}
              className="px-6 py-3 bg-[var(--accent)] text-[var(--text)] rounded-2xl hover:opacity-90 transition-opacity"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by hook:', error, errorInfo);
    
    try {
      // Optional: Send to monitoring service
    } catch {
      // Silent fail
    }
  };
}

// Higher-order component for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
