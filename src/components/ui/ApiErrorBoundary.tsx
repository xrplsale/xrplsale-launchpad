'use client';

import React, { useState, useEffect } from 'react';

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
  showRetry?: boolean;
  retryText?: string;
}

export function ApiErrorBoundary({ 
  children, 
  fallback,
  onError,
  showRetry = true,
  retryText = "Retry"
}: ApiErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = () => {
    setHasError(false);
    setError(null);
    setRetryKey(prev => prev + 1);
  };

  // Reset error state when children change
  useEffect(() => {
    setHasError(false);
    setError(null);
  }, [children, retryKey]);

  if (hasError && error) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="text-center py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-slate-400 mb-4 text-sm">
            {error.message || 'An unexpected error occurred'}
          </p>
          
          {showRetry && (
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {retryText}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ErrorCatcher
      onError={(error) => {
        setError(error);
        setHasError(true);
        onError?.(error);
      }}
      key={retryKey}
    >
      {children}
    </ErrorCatcher>
  );
}

// Internal error catcher component
interface ErrorCatcherProps {
  children: React.ReactNode;
  onError: (error: Error) => void;
}

class ErrorCatcher extends React.Component<ErrorCatcherProps, { hasError: boolean }> {
  constructor(props: ErrorCatcherProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('API Error Boundary caught an error:', error, errorInfo);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent handle the error display
    }

    return this.props.children;
  }
}

// Hook for handling API errors
export function useApiError() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleApiCall = async <T,>(
    apiCall: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      const message = errorMessage || (err instanceof Error ? err.message : 'API call failed');
      setError(message);
      console.error('API call failed:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    error,
    isLoading,
    handleApiCall,
    clearError
  };
}

// Component for displaying API loading states
interface ApiLoadingProps {
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingText?: string;
  emptyState?: React.ReactNode;
  isEmpty?: boolean;
}

export function ApiLoading({
  isLoading,
  error,
  onRetry,
  children,
  loadingText = "Loading...",
  emptyState,
  isEmpty = false
}: ApiLoadingProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">⚠️ {error}</div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty && emptyState) {
    return <>{emptyState}</>;
  }

  return <>{children}</>;
}