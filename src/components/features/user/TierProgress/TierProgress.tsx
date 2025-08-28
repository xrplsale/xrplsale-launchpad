import { ProgressBar } from '@/components/ui';
import { cn, getTierInfo, getTierByTokens, formatNumber } from '@/lib/utils';
// import type { TierInfo } from '@/types';

interface TierProgressProps {
  currentTokens: number;
  className?: string;
  showNextTier?: boolean;
}

export function TierProgress({ 
  currentTokens, 
  className,
  showNextTier = true 
}: TierProgressProps) {
  const currentTier = getTierByTokens(currentTokens);
  const nextTierLevel = Math.min(currentTier.tier_number + 1, 4);
  const nextTier = getTierInfo(nextTierLevel);
  
  // Calculate progress to next tier
  const tokensNeeded = nextTier.min_tokens_required - currentTokens;
  const progressFromCurrentTier = currentTokens - currentTier.min_tokens_required;
  const tierRange = nextTier.min_tokens_required - currentTier.min_tokens_required;
  const progressPercentage = tierRange > 0 ? Math.min((progressFromCurrentTier / tierRange) * 100, 100) : 100;
  
  const isMaxTier = currentTier.tier_number === 4;

  return (
    <div className={cn(
      'backdrop-blur-sm bg-slate-800/50 border border-slate-700/50 rounded-xl p-6',
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-300">Tier Progress</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">Current:</span>
          <div className={cn(
            'px-2 py-1 rounded text-xs font-medium text-white',
            `bg-gradient-to-r ${currentTier.color_scheme.gradient}`
          )}>
            {currentTier.name}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-300">
            <span className="font-medium text-white">{formatNumber(currentTokens)}</span>
            <span className="text-slate-400"> / {formatNumber(nextTier.min_tokens_required)} XSALE tokens</span>
          </div>
          {!isMaxTier && (
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-slate-400">to {nextTier.name}</div>
            </div>
          )}
        </div>

        {!isMaxTier ? (
          <ProgressBar 
            value={progressPercentage}
            variant="gradient"
            className="h-3"
            showPercentage={false}
          />
        ) : (
          <div className="py-2 text-center">
            <div className="text-sm text-yellow-400 font-medium">🎉 Maximum Tier Reached!</div>
          </div>
        )}

        {!isMaxTier && showNextTier && (
          <div className="pt-3 border-t border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Next Tier Benefits:</span>
              <div className={cn(
                'px-2 py-1 rounded text-xs font-medium text-white',
                `bg-gradient-to-r ${nextTier.color_scheme.gradient}`
              )}>
                {nextTier.name}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-yellow-400 font-medium">{nextTier.early_access_hours}h</div>
                <div className="text-slate-400">Early Access</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-green-400 font-medium">{nextTier.multiplier}x</div>
                <div className="text-slate-400">Multiplier</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                <div className="text-cyan-400 font-medium">{nextTier.guaranteed_allocation_percentage}%</div>
                <div className="text-slate-400">Allocation</div>
              </div>
            </div>

            {tokensNeeded > 0 && (
              <div className="mt-3 p-3 bg-purple-900/20 border border-purple-400/20 rounded-lg">
                <div className="text-xs text-center">
                  <span className="text-slate-300">Need </span>
                  <span className="text-purple-400 font-medium">{formatNumber(tokensNeeded)} more tokens</span>
                  <span className="text-slate-300"> to reach {nextTier.name}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}