'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  animate?: boolean;
  duration?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'gradient';
  backgroundColor?: string;
  children?: React.ReactNode;
  startOnView?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  showPercentage = true,
  animate = true,
  duration = 1500,
  color = 'primary',
  backgroundColor = 'rgba(71, 85, 105, 0.3)',
  children,
  startOnView = false,
}: ProgressRingProps) {
  const [currentProgress, setCurrentProgress] = useState(animate ? 0 : progress);
  const [isVisible, setIsVisible] = useState(!startOnView);
  const elementRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (currentProgress / 100) * circumference;

  useEffect(() => {
    if (startOnView && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(elementRef.current);

      return () => observer.disconnect();
    }
  }, [startOnView, isVisible]);

  useEffect(() => {
    if (!animate || !isVisible) {
      setCurrentProgress(progress);
      return;
    }

    const animateProgress = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progressPercent = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progressPercent, 4);
      const current = easeOutQuart * progress;
      
      setCurrentProgress(current);

      if (progressPercent < 1) {
        animationRef.current = requestAnimationFrame(animateProgress);
      }
    };

    animationRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [progress, animate, duration, isVisible]);

  const getStrokeColor = () => {
    switch (color) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'danger':
        return '#ef4444';
      case 'gradient':
        return 'url(#gradient-progress)';
      case 'primary':
      default:
        return 'url(#gradient-primary)';
    }
  };

  return (
    <div 
      ref={elementRef}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="rotate-[-90deg]"
      >
        <defs>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff007a" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#8be07d" />
          </linearGradient>
          <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          filter="url(#glow)"
          className="transition-all duration-300 ease-out"
        />
        
        {/* Animated dots */}
        {currentProgress > 0 && (
          <circle
            cx={size / 2}
            cy={strokeWidth / 2}
            r={strokeWidth / 2}
            fill="#fff"
            className="animate-pulse"
            transform={`rotate(${(currentProgress / 100) * 360} ${size / 2} ${size / 2})`}
          />
        )}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && !children && (
          <div className="text-center">
            <span className="text-2xl font-bold text-white animate-count-up">
              {Math.round(currentProgress)}%
            </span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// Compact version for inline use
export function ProgressRingCompact({ 
  progress, 
  size = 40,
  strokeWidth = 3,
  className 
}: Pick<ProgressRingProps, 'progress' | 'size' | 'strokeWidth' | 'className'>) {
  return (
    <ProgressRing
      progress={progress}
      size={size}
      strokeWidth={strokeWidth}
      showPercentage={false}
      className={className}
      animate={false}
    />
  );
}

// Linear progress bar variant
export function ProgressBar({
  progress,
  height = 8,
  className,
  animate = true,
  color = 'primary',
  showPercentage = false,
}: {
  progress: number;
  height?: number;
  className?: string;
  animate?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'gradient';
  showPercentage?: boolean;
}) {
  const [currentProgress, setCurrentProgress] = useState(animate ? 0 : progress);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setCurrentProgress(progress), 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(progress);
    }
  }, [progress, animate]);

  const getBarColor = () => {
    switch (color) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-orange-500';
      case 'danger':
        return 'bg-red-500';
      case 'gradient':
        return 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500';
      case 'primary':
      default:
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
    }
  };

  return (
    <div className={cn('relative', className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-slate-400 mb-1">
          <span>Progress</span>
          <span>{Math.round(currentProgress)}%</span>
        </div>
      )}
      <div 
        className="w-full bg-slate-700 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out relative',
            getBarColor()
          )}
          style={{ width: `${currentProgress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide" />
        </div>
      </div>
    </div>
  );
}