'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { BlogCategory } from '@/types/blog';

interface BlogSidebarProps {
  categories: BlogCategory[];
}

export function BlogSidebar({ categories }: BlogSidebarProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Categories
          </h3>
          <div className="space-y-3">
            <Link
              href="/blog"
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors text-slate-300 hover:text-white"
            >
              <span>All Articles</span>
              <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                {categories.reduce((sum, cat) => sum + cat.article_count, 0)}
              </span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700/30 transition-colors text-slate-300 hover:text-white group"
              >
                <div className="flex items-center">
                  <span 
                    className="w-2 h-2 rounded-full mr-3 flex-shrink-0" 
                    style={{ backgroundColor: category.color || 'var(--brand-primary)' }}
                  />
                  <span className="group-hover:text-white">{category.name}</span>
                </div>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                  {category.article_count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Newsletter
        </h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Get the latest XRPL insights and platform updates delivered to your inbox.
        </p>
        
        {!subscribed ? (
          <form onSubmit={handleNewsletterSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full btn-primary text-sm py-3"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400 text-sm font-medium">Thanks for subscribing!</p>
          </div>
        )}
      </div>

      {/* Popular Tags */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {['XRPL', 'DeFi', 'Trading', 'Platform', 'Tutorials', 'News'].map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag.toLowerCase()}`}
              className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-brand-primary/50 rounded-full text-sm text-slate-300 hover:text-brand-accent transition-all"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Follow Us
        </h3>
        <div className="flex gap-3">
          <a
            href="https://twitter.com/xrplsale"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-accent transition-all"
            aria-label="Follow on Twitter"
          >
            𝕏
          </a>
          <a
            href="https://discord.gg/xrplsale"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-accent transition-all"
            aria-label="Join Discord"
          >
            💬
          </a>
          <a
            href="https://t.me/xrplsale"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-accent transition-all"
            aria-label="Join Telegram"
          >
            📱
          </a>
        </div>
      </div>
    </div>
  );
}