'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatNumber?: (value: number) => string;
  startOnView?: boolean;
  delay?: number;
}

export function AnimatedCounter({
  value,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  formatNumber,
  startOnView = false,
  delay = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnView);
  const elementRef = useRef<HTMLSpanElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (startOnView && elementRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isVisible) {
              setIsVisible(true);
              observerRef.current?.disconnect();
            }
          });
        },
        { threshold: 0.1 }
      );

      observerRef.current.observe(elementRef.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, [startOnView, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startAnimation = () => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = easeOutQuart * value;
        
        setCount(currentValue);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [value, duration, delay, isVisible]);

  const displayValue = formatNumber 
    ? formatNumber(count)
    : count.toFixed(decimals);

  return (
    <span 
      ref={elementRef}
      className={cn(
        'inline-block tabular-nums transition-all duration-300',
        'animate-count-up',
        className
      )}
    >
      {prefix}
      <span className="number-transition">{displayValue}</span>
      {suffix}
    </span>
  );
}

// Specialized formatters
export const formatters = {
  currency: (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  },
  
  percentage: (value: number) => {
    return `${value.toFixed(1)}%`;
  },
  
  compact: (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toFixed(0);
  },
  
  decimal: (decimals: number = 2) => {
    return (value: number) => value.toFixed(decimals);
  },
  
  xrp: (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  },
};