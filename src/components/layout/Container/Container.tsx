import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'xl', padding = 'md', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full',
          {
            // Size variants
            'max-w-3xl': size === 'sm',
            'max-w-5xl': size === 'md',
            'max-w-6xl': size === 'lg',
            'max-w-7xl': size === 'xl',
            'max-w-none': size === 'full',
            
            // Padding variants
            'px-0': padding === 'none',
            'px-4 sm:px-6': padding === 'sm',
            'px-4 sm:px-6 lg:px-8': padding === 'md',
            'px-6 sm:px-8 lg:px-12': padding === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export { Container };