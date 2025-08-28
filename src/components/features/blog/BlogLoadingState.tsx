// Enhanced loading skeleton for blog components
export function BlogLoadingState() {
  return (
    <div className="space-y-12">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-64 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
        <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-96 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
      </div>

      {/* Articles grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-card rounded-xl p-6 overflow-hidden">
            {/* Image skeleton */}
            <div className="aspect-video bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg mb-6 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
            
            {/* Category badge skeleton */}
            <div className="w-20 h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-full mb-4 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
            
            {/* Title skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
              <div className="h-6 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-3/4 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
            </div>
            
            {/* Excerpt skeleton */}
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
              <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
              <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-2/3 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
            </div>
            
            {/* Meta skeleton */}
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-24 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
              <div className="h-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded w-16 animate-pulse bg-[length:400%_100%] bg-loading-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}