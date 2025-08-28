'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout';
import { Logo } from '@/components/shared/Logo';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
}

interface NavigationProps {
  variant?: 'default' | 'transparent' | 'elevated';
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Changelog', href: '/changelog' },
  { name: 'XSALE Presale', href: '/projects/0', highlight: true },
];

export function Navigation({ variant = 'default' }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for nav background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const getNavClasses = () => {
    const baseClasses = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300';
    
    switch (variant) {
      case 'transparent':
        return `${baseClasses} ${
          scrolled 
            ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-xl' 
            : 'bg-transparent border-b border-transparent'
        }`;
      case 'elevated':
        return `${baseClasses} bg-slate-900 border-b border-slate-700 shadow-lg`;
      default:
        return `${baseClasses} ${
          scrolled 
            ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-xl' 
            : 'bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/30'
        }`;
    }
  };

  return (
    <nav className={getNavClasses()}>
      <Container size="xl" padding="md">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group transition-transform hover:scale-105"
          >
            <Logo size="md" variant="full" className="transition-all group-hover:drop-shadow-lg" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'text-purple-400 bg-purple-400/15 shadow-md'
                        : item.highlight
                        ? 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    } ${
                      item.highlight ? 'ring-1 ring-cyan-400/30' : ''
                    }`}
                  >
                    {item.name}
                    {active && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
              
              {/* CTA Button */}
              <div className="ml-4">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
                  onClick={() => window.location.href = '/projects/0'}
                >
                  Join Presale
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
                    isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        
        {/* Mobile Navigation Menu */}
        <div 
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-2 py-4 space-y-2 bg-slate-800/90 backdrop-blur-md rounded-xl mt-4 border border-slate-700/50 shadow-xl">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    active
                      ? 'text-purple-400 bg-purple-400/15 border border-purple-400/20'
                      : item.highlight
                      ? 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/10 border border-cyan-400/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60 border border-transparent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="flex-1">{item.name}</span>
                  {active && (
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  )}
                </Link>
              );
            })}
            
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-slate-700/50">
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/projects/0';
                }}
              >
                Join Presale
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}