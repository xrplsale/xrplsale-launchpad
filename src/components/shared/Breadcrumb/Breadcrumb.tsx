'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`flex items-center space-x-2 text-sm font-medium ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {/* Home Icon */}
        <li>
          <Link
            href="/"
            className="text-slate-400 hover:text-purple-400 transition-colors duration-200 cursor-magnetic"
            aria-label="Home"
          >
            <HomeIcon className="w-4 h-4" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const Icon = item.icon;

          return (
            <li key={item.label} className="flex items-center space-x-2">
              {/* Separator */}
              <ChevronRightIcon 
                className="w-4 h-4 text-slate-500 animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              />
              
              {/* Breadcrumb Item */}
              <div className={`flex items-center space-x-1 ${
                isLast ? 'animate-fade-in-up' : 'animate-slide-in-right'
              }`} style={{ animationDelay: `${index * 100 + 50}ms` }}>
                {Icon && (
                  <Icon className={`w-4 h-4 ${
                    isLast ? 'text-purple-400' : 'text-slate-400'
                  }`} />
                )}
                
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-purple-400 transition-all duration-200 cursor-magnetic hover:scale-105"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span 
                    className={`${
                      isLast 
                        ? 'text-purple-400 font-semibold text-glow' 
                        : 'text-slate-300'
                    }`}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Breadcrumb variants for different sections
export function ProjectBreadcrumb({ projectId, projectName }: { projectId: string; projectName?: string }) {
  const items: BreadcrumbItem[] = [
    { label: 'Projects', href: '/projects' },
    { label: projectName || `Project ${projectId}`, current: true }
  ];

  return <Breadcrumb items={items} />;
}

export function BlogBreadcrumb({ category, title }: { category?: string; title?: string }) {
  const items: BreadcrumbItem[] = [
    { label: 'Blog', href: '/blog' }
  ];

  if (category) {
    items.push({ label: category, href: `/blog/category/${category.toLowerCase()}` });
  }

  if (title) {
    items.push({ label: title, current: true });
  }

  return <Breadcrumb items={items} />;
}