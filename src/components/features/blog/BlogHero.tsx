'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { BlogCategory } from '@/types/blog';

interface BlogHeroProps {
  categories: BlogCategory[];
  initialSearch?: string;
}

export function BlogHero({ categories, initialSearch }: BlogHeroProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,_rgba(255,0,122,0.08),_transparent_50%)] bg-[radial-gradient(circle_at_70%_30%,_rgba(244,114,182,0.06),_transparent_50%)]" />
      
      <div className="relative container-main py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Blog Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
            <span className="text-brand-accent font-medium">XRPL Insights & Updates</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-display-2xl heading-hero mb-6">
            <span className="text-gradient-brand">XRPL.Sale</span> Blog
          </h1>
          <p className="text-body-enhanced text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Stay updated with the latest XRPL ecosystem insights, platform updates, and DeFi trends. 
            Learn from industry experts and discover opportunities in the XRP Ledger ecosystem.
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-accent/15 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                <div className="relative">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, topics, or questions..."
                    className="search-input w-full"
                    aria-label="Search blog articles"
                  />
                  <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-brand-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <button 
                    type="submit"
                    className="absolute inset-y-0 right-4 flex items-center px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Category Quick Links */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              <Link
                href="/blog"
                className="btn-ghost text-sm"
              >
                All Articles
              </Link>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/category/${category.slug}`}
                  className="btn-ghost text-sm"
                  style={{
                    '--category-color': category.color || 'var(--brand-primary)'
                  } as React.CSSProperties}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-2 inline-block" 
                    style={{ backgroundColor: category.color || 'var(--brand-primary)' }}
                  />
                  {category.name}
                  <span className="ml-1 text-xs text-slate-400">
                    ({category.article_count})
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Featured Badge */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/blog?featured=true"
              className="inline-flex items-center gap-2 text-sm text-brand-accent hover:text-brand-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              View Featured Articles
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}