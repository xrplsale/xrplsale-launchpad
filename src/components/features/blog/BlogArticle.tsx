'use client';

import Image from 'next/image';
import type { BlogArticle as BlogArticleType } from '@/types/blog';

interface BlogArticleProps {
  article: BlogArticleType;
}

export function BlogArticle({ article }: BlogArticleProps) {
  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle content with better error boundaries
  const sanitizedContent = article.content || '<p>Content not available.</p>';

  return (
    <article className="max-w-none prose-article">
      {/* Article Header */}
      <header className="mb-8 lg:mb-12">
        {/* Category and Featured Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div 
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border backdrop-blur-sm"
            style={{
              backgroundColor: `${article.category.color || 'var(--brand-primary)'}20`,
              borderColor: `${article.category.color || 'var(--brand-primary)'}40`,
              color: article.category.color || 'var(--brand-accent)'
            }}
          >
            {article.category.name}
          </div>
          {article.is_featured && (
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand-primary to-brand-accent px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-white">Featured</span>
            </div>
          )}
        </div>

        {/* Title with improved typography */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 lg:mb-8 leading-tight tracking-tight">
          {article.title}
        </h1>

        {/* Excerpt with better spacing */}
        <div className="mb-8">
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 leading-relaxed max-w-4xl font-light">
            {article.excerpt}
          </p>
        </div>

        {/* Author & Meta Section - Improved Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 border-y border-slate-700">
          {/* Left: Author & Date */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white text-sm">By {article.author}</span>
                <time dateTime={article.published_at} className="text-slate-400 text-sm">
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>
          
          {/* Right: Reading Stats */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{article.read_time_minutes} min read</span>
            </div>
            {article.view_count > 0 && (
              <>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium">{article.view_count.toLocaleString()} views</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Share Section - Simplified and Prominent */}
        <div className="flex items-center justify-between gap-4 pt-6">
          <div className="text-sm text-slate-400">
            Share this article
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 rounded-lg text-slate-300 hover:text-brand-accent transition-all text-sm font-medium"
              aria-label="Share article"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://xrpl-sale-frontend.vercel.app/blog/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-blue-600/20 border border-slate-600 hover:border-blue-400/50 rounded-lg text-slate-300 hover:text-blue-400 transition-all text-sm font-medium"
              aria-label="Share on X (Twitter)"
            >
              <span className="font-bold">𝕏</span>
              <span className="hidden sm:inline">Tweet</span>
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(`https://xrpl-sale-frontend.vercel.app/blog/${article.slug}`)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 rounded-lg text-slate-300 hover:text-brand-accent transition-all text-sm font-medium"
              aria-label="Copy article link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Copy</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image with improved styling */}
      {article.featured_image && (
        <div className="relative aspect-video mb-12 lg:mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={article.featured_image}
            alt={`Featured image for ${article.title}`}
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
        </div>
      )}

      {/* Article Content with enhanced wrapper */}
      <div className="prose-content-wrapper max-w-none">
        <div 
          className="prose-content prose-enhanced"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
      </div>

      {/* Enhanced Tags Section */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 lg:mt-16 pt-8 lg:pt-12 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h3 className="text-xl font-bold text-white">Related Topics</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {article.tags.map((tag, index) => (
              <button
                key={tag}
                className="group relative inline-flex items-center px-4 py-2.5 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600 hover:border-brand-accent/50 rounded-full text-sm font-medium text-slate-300 hover:text-brand-accent transition-all duration-200 backdrop-blur-sm"
                aria-label={`View more articles tagged with ${tag}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10">#{tag}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}