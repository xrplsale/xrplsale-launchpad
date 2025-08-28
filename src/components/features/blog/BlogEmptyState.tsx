import Link from 'next/link';

interface BlogEmptyStateProps {
  search?: string;
  category?: string;
  featuredOnly?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export function BlogEmptyState({ search, category, featuredOnly, isError, errorMessage }: BlogEmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isError ? 'bg-red-900/20 border border-red-800/30' : 'bg-slate-800'
        }`}>
          {isError ? (
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Message */}
        <h3 className="text-xl font-semibold text-white mb-4">
          {isError && 'Unable to Load Articles'}
          {!isError && search && `No results for "${search}"`}
          {!isError && category && `No articles in ${category}`}
          {!isError && featuredOnly && 'No featured articles'}
          {!isError && !search && !category && !featuredOnly && 'No articles found'}
        </h3>
        
        <p className="text-slate-400 mb-8 leading-relaxed">
          {isError && (errorMessage || "We're having trouble connecting to our servers. Please try again in a moment.")}
          {!isError && search && "Try searching for something else or browse all articles."}
          {!isError && category && "Check out other categories or browse all articles."}
          {!isError && featuredOnly && "Featured articles are coming soon. Browse all articles in the meantime."}
          {!isError && !search && !category && !featuredOnly && "Articles are coming soon. Check back later for XRPL insights and updates."}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isError ? (
            <>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="btn-secondary"
              >
                Back to Home
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/blog"
                className="btn-primary"
              >
                Browse All Articles
              </Link>
              <Link
                href="/"
                className="btn-secondary"
              >
                Back to Home
              </Link>
            </>
          )}
        </div>

        {/* Suggestions */}
        {search && (
          <div className="mt-8 pt-8 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-4">Try these popular topics:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['XRPL', 'DeFi', 'Trading', 'Platform'].map((topic) => (
                <Link
                  key={topic}
                  href={`/blog?search=${topic}`}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-sm text-slate-300 hover:text-brand-accent transition-all"
                >
                  {topic}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}