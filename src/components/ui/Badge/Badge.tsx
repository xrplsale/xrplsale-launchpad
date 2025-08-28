import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-700 text-slate-300 hover:bg-slate-600',
        secondary: 'border-transparent bg-slate-600 text-slate-200 hover:bg-slate-500',
        destructive: 'border-transparent bg-red-500/20 text-red-400 hover:bg-red-500/30',
        outline: 'border-slate-600 text-slate-400 hover:border-slate-500',
        success: 'border-transparent bg-green-500/20 text-green-400 hover:bg-green-500/30',
        warning: 'border-transparent bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30',
        info: 'border-transparent bg-blue-500/20 text-blue-400 hover:bg-blue-500/30',
        purple: 'border-transparent bg-purple-500/20 text-purple-400 hover:bg-purple-500/30',
        pink: 'border-transparent bg-pink-500/20 text-pink-400 hover:bg-pink-500/30',
        cyan: 'border-transparent bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };