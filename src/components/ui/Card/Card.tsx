'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../Skeleton';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  loading?: boolean;
  shimmer?: boolean;
  glow?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md', 
    hover = false, 
    loading = false,
    shimmer = false,
    glow = false,
    children,
    ...props 
  }, ref) => {
    // Loading state with skeleton
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            'rounded-xl border transition-all duration-200',
            {
              'p-0': padding === 'none',
              'p-3': padding === 'sm',
              'p-6': padding === 'md',
              'p-8': padding === 'lg',
              'p-10': padding === 'xl',
            },
            'bg-slate-800/50 border-slate-700',
            className
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex-1">
                <Skeleton variant="text" width="60%" className="mb-2" />
                <Skeleton variant="text" width="40%" className="h-3" />
              </div>
            </div>
            <Skeleton variant="rectangular" height={100} className="rounded-lg" />
            <div className="space-y-2">
              <Skeleton variant="text" />
              <Skeleton variant="text" />
              <Skeleton variant="text" width="70%" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border transition-all duration-300 relative',
          {
            // Variants
            'bg-slate-800/50 border-slate-700': variant === 'default',
            'bg-slate-800/70 border-slate-600 shadow-xl': variant === 'elevated',
            'bg-transparent border-slate-600': variant === 'outlined',
            'bg-slate-800/30 border-slate-700/50 backdrop-blur-sm': variant === 'glass',
            'bg-gradient-to-br from-slate-800/70 via-purple-900/20 to-slate-800/70 border-purple-500/30': variant === 'gradient',
            
            // Padding
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
            'p-10': padding === 'xl',
            
            // Hover effect
            'hover:border-purple-400/50 hover:transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10': hover,
            
            // Shimmer effect
            'overflow-hidden': shimmer,
          },
          className
        )}
        {...props}
      >
        {/* Shimmer overlay */}
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        )}
        
        {/* Glow effect */}
        {glow && (
          <>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-10 blur-xl group-hover:opacity-20 transition-opacity" />
          </>
        )}
        
        {/* Card content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-2xl font-bold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm text-slate-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};