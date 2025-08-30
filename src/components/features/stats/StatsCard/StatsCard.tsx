import { Card, AnimatedCounter, formatters } from '@/components/ui';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  variant?: 'default' | 'highlighted' | 'minimal' | 'glass';
  trend?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period?: string;
  };
  className?: string;
  loading?: boolean;
  animated?: boolean;
  formatter?: 'currency' | 'percentage' | 'compact' | 'xrp' | 'decimal';
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  variant = 'default',
  trend,
  loading = false,
  animated = true,
  formatter,
  decimals = 0,
  prefix = '',
  suffix = '',
  className 
}: StatsCardProps) {
  const getFormatFunction = () => {
    if (!formatter) return undefined;
    if (formatter === 'decimal') {
      return formatters.decimal(decimals);
    }
    return formatters[formatter];
  };
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.type) {
      case 'increase':
        return <span className="text-green-400">↗</span>;
      case 'decrease':
        return <span className="text-red-400">↘</span>;
      default:
        return <span className="text-slate-400">→</span>;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.type) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
        <div className="h-6 w-6 bg-slate-700 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-8 bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  if (variant === 'glass') {
    return (
      <div className={cn(
        'backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 rounded-xl p-6',
        'hover:bg-slate-800/70 hover:border-purple-400/30 transition-all duration-300',
        'shadow-lg hover:shadow-purple-400/10',
        className
      )}>
        {loading ? <LoadingSkeleton /> : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-300">{title}</h3>
              <span className="text-2xl filter drop-shadow-md">{icon}</span>
            </div>
            
            <div className="space-y-2">
              {animated && typeof value === 'number' ? (
                <AnimatedCounter
                  value={value}
                  className="text-2xl font-bold text-white"
                  formatNumber={getFormatFunction()}
                  decimals={decimals}
                  prefix={prefix}
                  suffix={suffix}
                  startOnView={true}
                  duration={1500}
                />
              ) : (
                <p className="text-2xl font-bold text-white">{value}</p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{subtitle}</p>
                {trend && (
                  <div className={cn('text-xs flex items-center gap-1', getTrendColor())}>
                    {getTrendIcon()}
                    <span>{Math.abs(trend.value)}%</span>
                    {trend.period && <span className="text-slate-500">({trend.period})</span>}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('text-center', className)}>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 w-8 bg-slate-700 rounded mx-auto mb-2"></div>
            <div className="h-6 bg-slate-700 rounded w-16 mx-auto mb-1"></div>
            <div className="h-3 bg-slate-700 rounded w-12 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-2">{icon}</div>
            {animated && typeof value === 'number' ? (
              <AnimatedCounter
                value={value}
                className="text-2xl font-bold text-white mb-1"
                formatNumber={getFormatFunction()}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                startOnView={true}
                duration={1500}
              />
            ) : (
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
            )}
            <div className="text-sm text-slate-400">{title}</div>
            {trend && (
              <div className={cn('text-xs mt-1 flex items-center justify-center gap-1', getTrendColor())}>
                {getTrendIcon()}
                <span>{Math.abs(trend.value)}%</span>
                {trend.period && <span className="text-slate-500">({trend.period})</span>}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  if (variant === 'highlighted') {
    return (
      <Card 
        variant="elevated" 
        hover 
        className={cn(
          'border-purple-400/20 bg-gradient-to-br from-slate-800/70 to-purple-900/20',
          className
        )}
      >
        {loading ? <LoadingSkeleton /> : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-200">{title}</h3>
              <span className="text-3xl filter drop-shadow-lg">{icon}</span>
            </div>
            
            <div className="space-y-2">
              {animated && typeof value === 'number' ? (
                <AnimatedCounter
                  value={value}
                  className="text-3xl font-bold text-white"
                  formatNumber={getFormatFunction()}
                  decimals={decimals}
                  prefix={prefix}
                  suffix={suffix}
                  startOnView={true}
                  duration={1500}
                />
              ) : (
                <p className="text-3xl font-bold text-white">{value}</p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">{subtitle}</p>
                {trend && (
                  <div className={cn('text-sm flex items-center gap-1', getTrendColor())}>
                    {getTrendIcon()}
                    <span>{Math.abs(trend.value)}%</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    );
  }

  // Default variant
  return (
    <Card 
      hover 
      className={cn(
        'border-slate-700 hover:border-purple-400/50',
        className
      )}
    >
      {loading ? <LoadingSkeleton /> : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-300">{title}</h3>
            <span className="text-2xl">{icon}</span>
          </div>
          
          <div className="space-y-2">
            {animated && typeof value === 'number' ? (
              <AnimatedCounter
                value={value}
                className="text-2xl font-bold text-white"
                formatNumber={getFormatFunction()}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                startOnView={true}
                duration={1500}
              />
            ) : (
              <p className="text-2xl font-bold text-white">{value}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{subtitle}</p>
              {trend && (
                <div className={cn('text-xs flex items-center gap-1', getTrendColor())}>
                  {getTrendIcon()}
                  <span>{Math.abs(trend.value)}%</span>
                  {trend.period && <span className="text-slate-500">({trend.period})</span>}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}