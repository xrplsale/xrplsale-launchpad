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
            <div className="flex items-center space-x-1 relative">
              {/* Active indicator background */}
              <div 
                className="absolute h-10 bg-gradient-to-r from-purple-400/20 to-cyan-400/20 rounded-lg transition-all duration-500 ease-out backdrop-blur-sm border border-purple-400/30"
                style={{
                  width: '0px',
                  left: '0px',
                  opacity: 0,
                  transform: 'translateX(0px)'
                }}
                id="nav-indicator"
              />
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    data-nav-index={index}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 nav-item group z-10 ${
                      active
                        ? 'text-purple-300 font-semibold'
                        : item.highlight
                        ? 'text-cyan-300 hover:text-cyan-200'
                        : 'text-slate-300 hover:text-white'
                    } ${
                      item.highlight ? 'ring-1 ring-cyan-400/30 hover:ring-cyan-400/50' : ''
                    }`}
                    onMouseEnter={(e) => {
                      const indicator = document.getElementById('nav-indicator');
                      if (indicator) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const parentRect = e.currentTarget.parentElement!.getBoundingClientRect();
                        indicator.style.width = `${rect.width}px`;
                        indicator.style.left = `${rect.left - parentRect.left}px`;
                        indicator.style.opacity = '1';
                        indicator.style.transform = 'translateX(0px) scale(1.02)';
                      }
                    }}
                    onMouseLeave={() => {
                      const indicator = document.getElementById('nav-indicator');
                      if (indicator && !isActive(item.href)) {
                        indicator.style.opacity = '0';
                        indicator.style.transform = 'translateX(0px) scale(0.98)';
                      }
                    }}
                  >
                    <span className="relative z-10 transition-all duration-200 group-hover:scale-105">
                      {item.name}
                    </span>
                    {active && (
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-fade-in" />
                    )}
                    {/* Magnetic hover glow */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-glow-pulse" />
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

        
        {/* Enhanced Mobile Navigation Menu with Staggered Animations */}
        <div 
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
            isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-2 py-4 bg-slate-800/95 backdrop-blur-xl rounded-xl mt-4 border border-slate-700/50 shadow-2xl relative overflow-hidden">
            {/* Mobile menu background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            
            <div className="space-y-2 relative z-10">
              {navItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 group border ${
                      active
                        ? 'text-purple-400 bg-purple-400/15 border-purple-400/30 shadow-lg shadow-purple-400/20'
                        : item.highlight
                        ? 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-400/10 border-cyan-400/20 hover:border-cyan-400/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/60 border-transparent hover:border-slate-600/50'
                    } ${
                      isOpen ? 'animate-slide-in-right' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex-1 group-hover:scale-105 transition-transform duration-200">{item.name}</span>
                    {active && (
                      <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse" />
                    )}
                    {item.highlight && !active && (
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
            
            {/* Enhanced Mobile CTA */}
            <div className={`pt-4 mt-4 border-t border-slate-700/50 relative z-10 ${
              isOpen ? 'animate-fade-in-up' : ''
            }`} style={{ animationDelay: `${navItems.length * 50 + 100}ms` }}>
              <Button
                variant="primary"
                size="md"
                fullWidth
                className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 shadow-xl hover:shadow-purple-500/25 transition-all transform hover:scale-105 font-semibold"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/projects/0';
                }}
              >
                <span className="mr-2">🚀</span>
                Join Presale
                <span className="ml-2 text-xs opacity-75">Limited Time</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}