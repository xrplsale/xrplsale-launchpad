'use client';

import { useEffect, useRef, useState, RefObject } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useIntersectionObserver<T extends Element>(
  options: UseIntersectionObserverOptions = {}
): [RefObject<T>, boolean] {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0
  } = options;

  const elementRef = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsInView(true);
                if (triggerOnce) {
                  setHasTriggered(true);
                }
              }, delay);
            } else {
              setIsInView(true);
              if (triggerOnce) {
                setHasTriggered(true);
              }
            }
          } else if (!triggerOnce && !hasTriggered) {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  // Disconnect observer after first trigger if triggerOnce is true
  useEffect(() => {
    if (hasTriggered && triggerOnce && elementRef.current) {
      // Observer is automatically cleaned up in the cleanup function above
    }
  }, [hasTriggered, triggerOnce]);

  return [elementRef, isInView];
}

// Hook for multiple elements with staggered animations
export function useStaggeredIntersectionObserver<T extends Element>(
  count: number,
  options: UseIntersectionObserverOptions & { staggerDelay?: number } = {}
): [RefObject<T>[], boolean[]] {
  const { staggerDelay = 100, ...observerOptions } = options;
  const refs = useRef<RefObject<T>[]>(
    Array.from({ length: count }, () => ({ current: null }))
  );
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    Array(count).fill(false)
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((ref, index) => {
      const element = ref.current;
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setInViewStates(prev => {
                  const newStates = [...prev];
                  newStates[index] = true;
                  return newStates;
                });
              }, index * staggerDelay);
            }
          });
        },
        observerOptions
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [count, staggerDelay, observerOptions]);

  return [refs.current, inViewStates];
}

// Hook for parallax scrolling effects
export function useParallaxScroll(speed: number = 0.5) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      const rate = scrolled * speed;

      elementRef.current.style.setProperty('--parallax-y', `${rate}px`);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return elementRef;
}

// Hook for magnetic cursor following effect
export function useMagneticHover<T extends HTMLElement>(strength: number = 0.3) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = 'translate(0px, 0px) scale(1)';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return elementRef;
}