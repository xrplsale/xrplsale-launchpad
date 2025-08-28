'use client';

import Link from 'next/link';
import { BlogCard } from './BlogCard';
import { BlogEmptyState } from './BlogEmptyState';
import { BlogPagination } from './BlogPagination';
import type { BlogListResponse } from '@/types/blog';

interface BlogListProps {
  articlesData: BlogListResponse | null;
  currentPage: number;
  category?: string;
  search?: string;
  featuredOnly?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export function BlogList({ 
  articlesData, 
  currentPage, 
  category, 
  search, 
  featuredOnly,
  isError,
  errorMessage 
}: BlogListProps) {
  // Show empty state if no articles
  if (!articlesData || !articlesData.articles?.length) {
    return (
      <BlogEmptyState 
        search={search}
        category={category}
        featuredOnly={featuredOnly}
        isError={isError}
        errorMessage={errorMessage}
      />
    );
  }

  const { articles, total_count, total_pages, has_next, has_prev } = articlesData;

  return (
    <div className="space-y-12">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {search && `Search results for "${search}"`}
            {category && `Articles in ${category}`}
            {featuredOnly && 'Featured Articles'}
            {!search && !category && !featuredOnly && 'Latest Articles'}
          </h2>
          <p className="text-slate-400 text-sm">
            {total_count} article{total_count !== 1 ? 's' : ''} found
            {currentPage > 1 && ` • Page ${currentPage} of ${total_pages}`}
          </p>
        </div>

        {/* View Options */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Sort by:</span>
            <select className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-slate-300 text-sm focus:outline-none focus:border-brand-primary">
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <BlogCard 
            key={article.id}
            article={article}
            priority={index < 6} // Load first 6 images with priority
          />
        ))}
      </div>

      {/* Pagination */}
      {total_pages > 1 && (
        <BlogPagination
          currentPage={currentPage}
          totalPages={total_pages}
          hasNext={has_next}
          hasPrev={has_prev}
          category={category}
          search={search}
          featuredOnly={featuredOnly}
        />
      )}

      {/* Load More Button (for smaller screens or infinite scroll) */}
      {has_next && (
        <div className="text-center md:hidden">
          <Link
            href={`/blog?page=${currentPage + 1}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}${featuredOnly ? '&featured=true' : ''}`}
            className="btn-secondary"
          >
            Load More Articles
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}