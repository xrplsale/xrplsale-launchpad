'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, type ToastProps } from './Toast';

interface ToastContextType {
  addToast: (toast: Omit<ToastProps, 'id' | 'onDismiss'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  toasts: ToastProps[];
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ 
  children,
  position = 'top-right',
}: { 
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onDismiss'>) => {
    const id = Date.now().toString() + Math.random().toString(36);
    
    const newToast: ToastProps = {
      ...toast,
      id,
      onDismiss: () => removeToast(id),
    };

    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        clearAllToasts,
        toasts,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} position={position} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    ...context,
    success: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'description' | 'onDismiss'>>) =>
      context.addToast({ ...options, type: 'success', description: message }),
    
    error: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'description' | 'onDismiss'>>) =>
      context.addToast({ ...options, type: 'error', description: message }),
    
    warning: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'description' | 'onDismiss'>>) =>
      context.addToast({ ...options, type: 'warning', description: message }),
    
    info: (message: string, options?: Partial<Omit<ToastProps, 'id' | 'type' | 'description' | 'onDismiss'>>) =>
      context.addToast({ ...options, type: 'info', description: message }),
  };
}