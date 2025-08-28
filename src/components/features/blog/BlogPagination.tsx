import Link from 'next/link';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  category?: string;
  search?: string;
  featuredOnly?: boolean;
}

export function BlogPagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  category,
  search,
  featuredOnly
}: BlogPaginationProps) {
  // Build query string
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    if (featuredOnly) params.set('featured', 'true');
    return `/blog?${params.toString()}`;
  };

  // Generate page numbers with smart truncation
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart truncation
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="Blog pagination">
      {/* Previous Button */}
      {hasPrev ? (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 rounded-lg text-sm text-slate-300 hover:text-brand-accent transition-all"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Link>
      ) : (
        <div className="flex items-center px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-500 cursor-not-allowed">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </div>
      )}

      {/* Page Numbers */}
      <div className="hidden md:flex items-center space-x-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-slate-500">
                ...
              </span>
            );
          }
          
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          
          return (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 text-slate-300 hover:text-brand-accent'
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Mobile Page Info */}
      <div className="md:hidden px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-400">
        {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      {hasNext ? (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-brand-primary/50 rounded-lg text-sm text-slate-300 hover:text-brand-accent transition-all"
          aria-label="Next page"
        >
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <div className="flex items-center px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-500 cursor-not-allowed">
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </nav>
  );
}