'use client';

interface PlaceholderCardProps {
  title: string;
  description: string;
  icon?: string;
  status?: 'coming-soon' | 'in-development' | 'beta' | 'disabled';
  actionText?: string;
  onAction?: () => void;
  showComingSoon?: boolean;
  className?: string;
}

export function PlaceholderCard({
  title,
  description,
  icon = '🚧',
  status = 'coming-soon',
  actionText,
  onAction,
  showComingSoon = true,
  className = ''
}: PlaceholderCardProps) {
  const statusConfig = {
    'coming-soon': {
      badge: 'Coming Soon',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      cardOpacity: 'opacity-75'
    },
    'in-development': {
      badge: 'In Development',
      badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      cardOpacity: 'opacity-80'
    },
    'beta': {
      badge: 'Beta',
      badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30',
      cardOpacity: 'opacity-90'
    },
    'disabled': {
      badge: 'Temporarily Disabled',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      cardOpacity: 'opacity-60'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`
      relative bg-gradient-to-br from-slate-800 to-slate-900 
      rounded-xl p-6 border border-slate-700 
      ${config.cardOpacity} ${className}
    `}>
      {/* Status Badge */}
      {showComingSoon && (
        <div className={`
          absolute top-4 right-4 px-3 py-1 rounded-full 
          text-xs font-medium border ${config.badgeColor}
        `}>
          {config.badge}
        </div>
      )}

      {/* Content */}
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        
        <h3 className="text-xl font-bold text-white mb-2">
          {title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {description}
        </p>

        {/* Action Button */}
        {actionText && onAction && (
          <button
            onClick={onAction}
            disabled={status === 'disabled'}
            className={`
              px-6 py-2 rounded-lg font-medium transition-all
              ${status === 'disabled' 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105'
              }
            `}
          >
            {actionText}
          </button>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-xl pointer-events-none"></div>
      <div className="absolute top-0 left-4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>
    </div>
  );
}

// Specialized placeholder for investment features
export function InvestmentPlaceholder({ className = '' }: { className?: string }) {
  return (
    <PlaceholderCard
      title="Investment Portal"
      description="Direct project investments and portfolio tracking will be available once the backend investment system is implemented."
      icon="💰"
      status="in-development"
      actionText="Notify When Ready"
      onAction={() => {
        // Could implement email notification signup
        alert('We\'ll notify you when investment features are ready!');
      }}
      className={className}
    />
  );
}

// Specialized placeholder for user profiles
export function UserProfilePlaceholder({ className = '' }: { className?: string }) {
  return (
    <PlaceholderCard
      title="User Profiles"
      description="User authentication, profiles, and personalized dashboards are being developed for the next release."
      icon="👤"
      status="coming-soon"
      showComingSoon={true}
      className={className}
    />
  );
}

// Specialized placeholder for advanced analytics
export function AdvancedAnalyticsPlaceholder({ className = '' }: { className?: string }) {
  return (
    <PlaceholderCard
      title="Advanced Analytics"
      description="Detailed investment analytics, performance tracking, and portfolio insights are coming soon."
      icon="📈"
      status="beta"
      actionText="Request Beta Access"
      onAction={() => {
        // Could implement beta signup
        window.open('mailto:support@xrpl.sale?subject=Beta Access Request', '_blank');
      }}
      className={className}
    />
  );
}

// Generic loading placeholder
export function LoadingPlaceholder({ 
  title = "Loading...", 
  className = '' 
}: { 
  title?: string; 
  className?: string; 
}) {
  return (
    <div className={`
      bg-slate-800/50 rounded-xl p-8 border border-slate-700 
      animate-pulse ${className}
    `}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-slate-400">{title}</p>
      </div>
    </div>
  );
}