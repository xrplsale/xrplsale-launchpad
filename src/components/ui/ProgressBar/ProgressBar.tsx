import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  label?: string;
  animated?: boolean;
  className?: string;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({
    value,
    max = 100,
    size = 'md',
    variant = 'default',
    showPercentage = false,
    label,
    animated = true,
    className,
    ...props
  }, ref) => {
    const percentage = Math.min((value / max) * 100, 100);

    const sizeClasses = {
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
    };

    const variantClasses = {
      default: 'bg-purple-400',
      gradient: 'bg-gradient-to-r from-purple-600 to-pink-600',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(label || showPercentage) && (
          <div className="flex justify-between items-center mb-2 text-sm">
            {label && <span className="text-slate-300">{label}</span>}
            {showPercentage && (
              <span className="text-slate-400">{percentage.toFixed(1)}%</span>
            )}
          </div>
        )}
        <div className={cn('w-full bg-slate-700 rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={cn(
              'rounded-full transition-all duration-500 ease-out',
              variantClasses[variant],
              {
                'animate-pulse': animated && percentage > 0,
              }
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };