'use client';

interface BlogStatusBannerProps {
  isUsingMockData?: boolean;
  onRetry?: () => void;
}

export function BlogStatusBanner({ isUsingMockData, onRetry }: BlogStatusBannerProps) {
  if (!isUsingMockData) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <div>
            <p className="text-amber-300 font-medium text-sm">
              Demo Mode
            </p>
            <p className="text-amber-200/80 text-xs">
              Showing sample articles - API connection unavailable
            </p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded text-amber-300 text-xs transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
}