'use client';

import React from 'react';
import { logger } from '@/lib/logger-simple';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  context?: string;
}

export class SimpleErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorId: Date.now().toString(36)
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { context = 'Unknown', onError } = this.props;
    
    // Log the error
    logger.error(`Error in ${context}`, {
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: context
    }, error);

    // Update state with error info
    this.setState({ error, errorInfo });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  retry = () => {
    logger.info(`Retrying after error in ${this.props.context}`, {
      errorId: this.state.errorId
    });
    
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: Date.now().toString(36)
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} retry={this.retry} />;
      }

      return (
        <div className="min-h-32 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <div className="text-center">
            <div className="text-red-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.08 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Something went wrong</h3>
            <p className="text-slate-300 text-sm mb-4">
              {this.props.context ? `Error in ${this.props.context}` : 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.retry}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-slate-400 text-sm">
                  Debug Info (ID: {this.state.errorId})
                </summary>
                <pre className="mt-2 p-3 bg-slate-800 rounded text-xs text-slate-300 overflow-x-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  context?: string
) {
  return function WrappedComponent(props: P) {
    return (
      <SimpleErrorBoundary context={context || Component.name}>
        <Component {...props} />
      </SimpleErrorBoundary>
    );
  };
}