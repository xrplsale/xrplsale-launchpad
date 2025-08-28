import Link from 'next/link';
import Image from 'next/image';
import type { BlogArticle } from '@/types/blog';

interface BlogCardProps {
  article: BlogArticle;
  priority?: boolean;
  compact?: boolean;
}

export function BlogCard({ article, priority = false, compact = false }: BlogCardProps) {
  const formattedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Link 
      href={`/blog/${article.slug}`}
      className="group block"
    >
      <article className="glass-card rounded-xl overflow-hidden hover-lift border-slate-700/30 group-hover:border-brand-primary/30 transition-all duration-300">
        {/* Featured Image */}
        {article.featured_image && (
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={article.featured_image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Featured Badge */}
            {article.is_featured && (
              <div className="absolute top-4 left-4">
                <div className="bg-gradient-to-r from-brand-primary to-brand-accent px-3 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-medium text-white">Featured</span>
                </div>
              </div>
            )}
            
            {/* Read Time Overlay */}
            <div className="absolute bottom-4 right-4">
              <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-xs text-white font-medium">
                  {article.read_time_minutes} min read
                </span>
              </div>
            </div>
          </div>
        )}

        <div className={`p-6 ${compact ? 'space-y-3' : 'space-y-4'}`}>
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <div 
              className="px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: `${article.category.color || 'var(--brand-primary)'}20`,
                borderColor: `${article.category.color || 'var(--brand-primary)'}40`,
                color: article.category.color || 'var(--brand-accent)'
              }}
            >
              {article.category.name}
            </div>
            {article.view_count > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{article.view_count}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-white group-hover:text-gradient-brand transition-all ${compact ? 'text-lg' : 'text-xl'} line-clamp-2`}>
            {article.title}
          </h3>

          {/* Excerpt */}
          {!compact && (
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          )}

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, compact ? 2 : 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs text-slate-400 hover:text-brand-accent transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{article.author}</span>
              </div>
              <span>•</span>
              <time dateTime={article.published_at}>
                {formattedDate}
              </time>
            </div>
            
            <div className="flex items-center text-brand-accent group-hover:translate-x-1 transition-transform">
              <span className="text-sm font-medium mr-1">Read</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}