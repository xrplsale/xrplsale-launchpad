import { BlogCard } from './BlogCard';
import type { RelatedArticle } from '@/types/blog';

interface BlogRelatedProps {
  articles: RelatedArticle[];
  currentArticleSlug: string;
}

export function BlogRelated({ articles, currentArticleSlug }: BlogRelatedProps) {
  // Filter out current article if somehow included
  const relatedArticles = articles.filter(article => article.slug !== currentArticleSlug);
  
  if (!relatedArticles.length) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
        <svg className="w-6 h-6 mr-3 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Related Articles
      </h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {relatedArticles.slice(0, 3).map((article) => (
          <BlogCard 
            key={article.id}
            article={article as any} // Type conversion - RelatedArticle has compatible structure
            compact={true}
          />
        ))}
      </div>

      {/* Show more related articles if available */}
      {relatedArticles.length > 3 && (
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            {relatedArticles.length - 3} more related articles in this category
          </p>
        </div>
      )}
    </div>
  );
}