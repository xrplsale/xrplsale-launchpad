import { cn, getTierInfo, getTierGradient } from '@/lib/utils';
// import type { TierInfo } from '@/types';

interface TierBadgeProps {
  tierLevel: number;
  size?: 'sm' | 'md' | 'lg';
  showMultiplier?: boolean;
  showIcon?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}

const tierIcons: Record<string, string> = {
  'Bronze': '🥉',
  'Silver': '🥈', 
  'Gold': '🥇',
  'Platinum': '💎',
  'Diamond': '💠'
};

export function TierBadge({ 
  tierLevel, 
  size = 'md', 
  showMultiplier = false,
  showIcon = true,
  variant = 'default',
  className 
}: TierBadgeProps) {
  const tierInfo = getTierInfo(tierLevel);
  const gradient = getTierGradient(tierLevel);
  const icon = tierIcons[tierInfo.name];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  if (variant === 'minimal') {
    return (
      <span 
        className={cn(
          'inline-flex items-center gap-1 rounded-full font-medium',
          `bg-gradient-to-r ${gradient}`,
          'text-white shadow-sm',
          sizeClasses[size],
          className
        )}
      >
        {showIcon && <span>{icon}</span>}
        <span>{tierInfo.name}</span>
        {showMultiplier && (
          <span className="opacity-90">({tierInfo.multiplier}x)</span>
        )}
      </span>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn(
        'backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 rounded-lg p-4',
        `hover:border-[${tierInfo.color_scheme.primary}]/30 transition-all duration-300`,
        className
      )}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div>
              <h3 className="font-semibold text-white">{tierInfo.name} Tier</h3>
              <p className="text-xs text-slate-400">Level {tierInfo.tier_number}</p>
            </div>
          </div>
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            `bg-gradient-to-r ${gradient}`,
            'text-white'
          )}>
            {tierInfo.multiplier}x
          </div>
        </div>
        
        <div className="space-y-1 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Early Access:</span>
            <span className="text-yellow-400">{tierInfo.early_access_hours}h</span>
          </div>
          <div className="flex justify-between">
            <span>Allocation:</span>
            <span className="text-green-400">{tierInfo.guaranteed_allocation_percentage}%</span>
          </div>
          <div className="flex justify-between">
            <span>Max Investment:</span>
            <span className="text-cyan-400">{tierInfo.max_investment_multiplier}x</span>
          </div>
        </div>

        {tierInfo.benefits.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Benefits:</p>
            <ul className="text-xs text-slate-300 space-y-0.5">
              {tierInfo.benefits.slice(0, 2).map((benefit, index) => (
                <li key={index} className="flex items-start gap-1">
                  <span className="text-green-400 text-[10px] mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
              {tierInfo.benefits.length > 2 && (
                <li className="text-slate-500 text-[10px]">
                  +{tierInfo.benefits.length - 2} more...
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div 
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-3 py-2',
        'backdrop-blur-sm bg-slate-800/50 border border-slate-700/50',
        `hover:border-[${tierInfo.color_scheme.primary}]/30 transition-all duration-300`,
        className
      )}
    >
      {showIcon && <span className="text-lg">{icon}</span>}
      <div className="flex flex-col">
        <span className="font-medium text-white text-sm">{tierInfo.name}</span>
        {showMultiplier && (
          <span className="text-xs text-slate-400">{tierInfo.multiplier}x Multiplier</span>
        )}
      </div>
    </div>
  );
}