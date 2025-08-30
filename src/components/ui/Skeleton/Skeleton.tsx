'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'shimmer';
  width?: string | number;
  height?: string | number;
  count?: number;
  delay?: number;
}

export function Skeleton({
  className,
  variant = 'text',
  animation = 'shimmer',
  width,
  height,
  count = 1,
  delay = 0,
  ...props
}: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rounded':
        return 'rounded-lg';
      case 'rectangular':
        return 'rounded-sm';
      case 'text':
      default:
        return 'rounded h-4 w-full';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse bg-slate-700';
      case 'wave':
        return 'bg-slate-700 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-wave before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent';
      case 'shimmer':
      default:
        return 'bg-slate-700 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent';
    }
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={cn(
        getVariantClasses(),
        getAnimationClasses(),
        className
      )}
      style={{
        width: width || (variant === 'circular' ? height : undefined),
        height: height || (variant === 'circular' ? width : undefined),
        animationDelay: `${delay + index * 100}ms`,
      }}
      {...props}
    />
  ));

  return count > 1 ? (
    <div className="space-y-2">
      {skeletons}
    </div>
  ) : (
    skeletons[0]
  );
}

// Skeleton variants for common use cases
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
          className="h-4"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-slate-700 p-6 space-y-4", className)}>
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="30%" className="h-3" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2">
        <Skeleton variant="rounded" width={80} height={32} />
        <Skeleton variant="rounded" width={80} height={32} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className }: { 
  rows?: number; 
  columns?: number; 
  className?: string 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Header */}
      <div className="flex gap-4 p-3 border-b border-slate-700">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} variant="text" className="h-5 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 p-3">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton 
              key={colIndex} 
              variant="text" 
              className="h-4 flex-1"
              delay={rowIndex * 50}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Skeleton 
      variant="circular" 
      width={size} 
      height={size} 
      className={className}
    />
  );
}

export function SkeletonButton({ width = 100, className }: { width?: number; className?: string }) {
  return (
    <Skeleton 
      variant="rounded" 
      width={width} 
      height={40} 
      className={cn("rounded-lg", className)}
    />
  );
}

// Add animations to the document if not already present
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }
    
    @keyframes wave {
      100% {
        transform: translateX(100%);
      }
    }
    
    .animate-shimmer::before {
      animation: shimmer 1.5s infinite;
    }
    
    .animate-wave::before {
      animation: wave 1.5s infinite;
    }
  `;
  
  if (!document.querySelector('#skeleton-animations')) {
    style.id = 'skeleton-animations';
    document.head.appendChild(style);
  }
}