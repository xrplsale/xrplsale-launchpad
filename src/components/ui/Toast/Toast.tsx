'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

export function Toast({
  id,
  title,
  description,
  type = 'info',
  duration = 5000,
  action,
  onDismiss,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (duration > 0) {
      timeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300);
  };

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/50 bg-green-900/50 backdrop-blur-sm text-green-100';
      case 'error':
        return 'border-red-500/50 bg-red-900/50 backdrop-blur-sm text-red-100';
      case 'warning':
        return 'border-orange-500/50 bg-orange-900/50 backdrop-blur-sm text-orange-100';
      case 'info':
      default:
        return 'border-blue-500/50 bg-blue-900/50 backdrop-blur-sm text-blue-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        getToastStyles(),
        isExiting
          ? 'opacity-0 transform translate-x-full scale-95'
          : 'opacity-100 transform translate-x-0 scale-100 animate-slide-in-right'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-medium">{title}</p>
            )}
            <p className={cn('text-sm', title ? 'mt-1' : '')}>
              {description}
            </p>
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  className={cn(
                    'rounded-md bg-white/10 px-3 py-2 text-xs font-medium backdrop-blur-sm transition-colors',
                    'hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50'
                  )}
                  onClick={() => {
                    action.onClick();
                    handleDismiss();
                  }}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md text-gray-400 hover:text-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-white/50'
              )}
              onClick={handleDismiss}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-black/20">
          <div
            className={cn(
              'h-full transition-all ease-linear',
              type === 'success' && 'bg-green-400',
              type === 'error' && 'bg-red-400',
              type === 'warning' && 'bg-orange-400',
              type === 'info' && 'bg-blue-400'
            )}
            style={{
              animation: `toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Toast container component
export function ToastContainer({
  toasts,
  position = 'top-right',
}: {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0';
      case 'top-center':
        return 'top-0 left-1/2 -translate-x-1/2';
      case 'bottom-left':
        return 'bottom-0 left-0';
      case 'bottom-right':
        return 'bottom-0 right-0';
      case 'bottom-center':
        return 'bottom-0 left-1/2 -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-0 right-0';
    }
  };

  return (
    <div
      aria-live="assertive"
      className={cn(
        'pointer-events-none fixed z-50 flex w-full max-w-sm flex-col space-y-4 p-6',
        getPositionClasses()
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Add progress bar animation styles
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toast-progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }
  `;
  
  if (!document.querySelector('#toast-animations')) {
    style.id = 'toast-animations';
    document.head.appendChild(style);
  }
}