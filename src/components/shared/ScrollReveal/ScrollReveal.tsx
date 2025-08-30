'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ReactNode, useState, useEffect } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 800,
  threshold = 0.1,
  className = '',
  triggerOnce = true
}: ScrollRevealProps) {
  const [elementRef, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    triggerOnce,
    delay
  });

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(60px) scale(0.95)';
      case 'down':
        return 'translateY(-60px) scale(0.95)';
      case 'left':
        return 'translateX(-60px) scale(0.95)';
      case 'right':
        return 'translateX(60px) scale(0.95)';
      case 'scale':
        return 'scale(0.8)';
      default:
        return 'translateY(60px) scale(0.95)';
    }
  };

  const getFinalTransform = () => {
    return 'translateY(0) translateX(0) scale(1)';
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? getFinalTransform() : getInitialTransform(),
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}

// Staggered reveal for multiple children
interface StaggeredRevealProps {
  children: ReactNode[];
  staggerDelay?: number;
  direction?: ScrollRevealProps['direction'];
  className?: string;
}

export function StaggeredReveal({
  children,
  staggerDelay = 100,
  direction = 'up',
  className = ''
}: StaggeredRevealProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {children.map((child, index) => (
        <ScrollReveal
          key={index}
          direction={direction}
          delay={index * staggerDelay}
          className="w-full"
        >
          {child}
        </ScrollReveal>
      ))}
    </div>
  );
}

// Parallax scroll component
interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxScroll({
  children,
  speed = 0.5,
  className = ''
}: ParallaxScrollProps) {
  const elementRef = useIntersectionObserver<HTMLDivElement>();

  return (
    <div
      className={`parallax-element ${className}`}
      style={{
        transform: `translateY(calc(var(--scroll-y, 0) * ${speed}))`
      }}
    >
      {children}
    </div>
  );
}

// Text reveal animation
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({
  text,
  className = '',
  delay = 0
}: TextRevealProps) {
  const [elementRef, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.5,
    delay
  });

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
    >
      <span
        className={`block transition-all duration-1000 ease-out ${
          isInView
            ? 'transform translate-y-0 opacity-100'
            : 'transform translate-y-full opacity-0'
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {text}
      </span>
      
      {/* Reveal overlay */}
      <div
        className={`absolute inset-0 bg-slate-900 transition-all duration-800 ease-out ${
          isInView ? 'transform translate-x-full' : 'transform translate-x-0'
        }`}
        style={{ transitionDelay: `${delay + 200}ms` }}
      />
    </div>
  );
}

// Counter animation component
interface CounterAnimationProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CounterAnimation({
  from = 0,
  to,
  duration = 2000,
  delay = 0,
  className = '',
  prefix = '',
  suffix = ''
}: CounterAnimationProps) {
  const [elementRef, isInView] = useIntersectionObserver<HTMLSpanElement>({
    threshold: 0.5
  });

  const [currentValue, setCurrentValue] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const startValue = currentValue;
    const difference = to - startValue;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = Math.floor(startValue + difference * easeOutQuart);
      
      setCurrentValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    const timer = setTimeout(updateCounter, delay);
    return () => clearTimeout(timer);
  }, [isInView, to, duration, delay, currentValue]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </span>
  );
}