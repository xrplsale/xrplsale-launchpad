'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25',
        secondary: 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 bg-transparent backdrop-blur-sm',
        outline: 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white bg-transparent',
        ghost: 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/25',
        success: 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-green-500/25',
        glow: 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg hover:shadow-purple-500/50 animate-gradient-x',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-8 py-3',
        xl: 'h-14 px-10 py-4 text-base',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      pulse: {
        true: 'animate-pulse-gentle',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      pulse: false,
    },
  }
);

interface RippleProps {
  x: number;
  y: number;
  size: number;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  ripple?: boolean;
  glow?: boolean;
  magnetic?: boolean;
  depth3D?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    loading, 
    icon, 
    iconPosition = 'left', 
    children, 
    disabled,
    ripple = true,
    glow = false,
    magnetic = false,
    depth3D = false,
    pulse,
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = useState<RippleProps[]>([]);
    const [magneticTransform, setMagneticTransform] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    // Combine refs
    React.useImperativeHandle(ref, () => buttonRef.current!);

    useEffect(() => {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }, [ripples]);

    // Magnetic hover effect
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || disabled || loading) return;
      
      const button = buttonRef.current;
      if (button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.2;
        const deltaY = (e.clientY - centerY) * 0.2;
        
        setMagneticTransform({ x: deltaX, y: deltaY });
      }
    };

    const handleMouseLeave = () => {
      if (magnetic) {
        setMagneticTransform({ x: 0, y: 0 });
      }
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const button = buttonRef.current;
        if (button) {
          const rect = button.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          setRipples([...ripples, { x, y, size }]);
        }
      }
      
      onClick?.(e);
    };

    // Enhanced loading spinner
    const LoadingSpinner = () => (
      <div className="relative">
        <svg 
          className="animate-spin h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {/* Pulsing dot indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1 w-1 bg-current rounded-full animate-ping" />
        </div>
      </div>
    );

    return (
      <button
        ref={buttonRef}
        className={cn(
          buttonVariants({ variant, size, fullWidth, pulse, className }),
          glow && variant === 'primary' && 'shadow-lg shadow-purple-500/50 hover:shadow-purple-500/75',
          loading && 'cursor-wait',
          magnetic && 'cursor-magnetic transition-transform duration-200 ease-out',
          depth3D && 'btn-3d transform-gpu perspective-1000'
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: magnetic 
            ? `translate(${magneticTransform.x}px, ${magneticTransform.y}px)` 
            : undefined,
          ...props.style
        }}
        {...props}
      >
        {/* Ripple Effect Container */}
        {ripples.map((ripple, index) => (
          <span
            key={index}
            className="absolute animate-ripple"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          >
            <span className="block w-full h-full rounded-full bg-white/30" />
          </span>
        ))}

        {/* Gradient Overlay for hover effect */}
        {variant === 'primary' && (
          <span className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/5 to-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}

        {/* Button Content */}
        <span className={cn(
          "relative z-10 flex items-center justify-center gap-2",
          loading && "opacity-70"
        )}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            icon && iconPosition === 'left' && (
              <span className={cn(
                "transition-transform duration-200",
                "group-hover:scale-110"
              )}>
                {icon}
              </span>
            )
          )}
          
          {children && (
            <span className={cn(
              loading && "ml-2"
            )}>
              {children}
            </span>
          )}
          
          {!loading && icon && iconPosition === 'right' && (
            <span className={cn(
              "transition-transform duration-200",
              "group-hover:scale-110"
            )}>
              {icon}
            </span>
          )}
        </span>

        {/* 3D Depth Effect */}
        {depth3D && (
          <span 
            className="absolute inset-0 -z-10 rounded-lg transition-all duration-300 ease-out"
            style={{
              background: 'inherit',
              transform: 'translateZ(-4px) translateY(2px)',
              filter: 'brightness(0.8)',
              opacity: 0.6
            }}
          />
        )}

        {/* Enhanced Glow effect background */}
        {glow && (
          <>
            <span className="absolute inset-0 -z-10 animate-pulse-slow">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50" />
            </span>
            {/* Magnetic glow enhancement */}
            {magnetic && (
              <span className="absolute inset-0 -z-20 animate-pulse-ring">
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl" />
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Add necessary animations to globals.css via style tag for now
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }
    
    .animate-ripple {
      animation: ripple 600ms ease-out forwards;
    }
    
    @keyframes gradient-x {
      0%, 100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }
    
    .animate-gradient-x {
      background-size: 200% 200%;
      animation: gradient-x 3s ease infinite;
    }
    
    @keyframes pulse-slow {
      0%, 100% {
        opacity: 0.5;
      }
      50% {
        opacity: 0.8;
      }
    }
    
    .animate-pulse-slow {
      animation: pulse-slow 2s ease-in-out infinite;
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.9);
        opacity: 0.8;
      }
      100% {
        transform: scale(1.3);
        opacity: 0;
      }
    }
    
    .animate-pulse-ring {
      animation: pulse-ring 2s ease-out infinite;
    }

    .btn-3d {
      transform-style: preserve-3d;
    }

    .btn-3d:hover {
      transform: translateY(-2px) scale(1.02);
    }

    .btn-3d:active {
      transform: translateY(0) scale(0.98);
      transition-duration: 0.1s;
    }

    .cursor-magnetic {
      cursor: pointer;
    }

    .perspective-1000 {
      perspective: 1000px;
    }
  `;
  
  if (!document.querySelector('#button-animations')) {
    style.id = 'button-animations';
    document.head.appendChild(style);
  }
}

// Enhanced Button variants with new props
const EnhancedButton = React.forwardRef<HTMLButtonElement, ButtonProps & {
  'data-magnetic'?: boolean;
  'data-3d'?: boolean;
}>((props, ref) => {
  return <Button ref={ref} {...props} />;
});

EnhancedButton.displayName = 'EnhancedButton';

export { Button, EnhancedButton, buttonVariants };