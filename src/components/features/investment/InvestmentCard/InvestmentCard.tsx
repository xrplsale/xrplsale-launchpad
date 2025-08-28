import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { TierBadge } from '@/components/features/user';
import { cn, formatXRP, formatDate } from '@/lib/utils';
import type { Investment } from '@/types';

interface InvestmentCardProps {
  investment: Investment;
  projectName?: string;
  className?: string;
  showProject?: boolean;
}

export function InvestmentCard({ 
  investment, 
  projectName,
  className,
  showProject = true 
}: InvestmentCardProps) {
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      confirmed: 'bg-green-500/20 text-green-400',
      pending: 'bg-yellow-500/20 text-yellow-400',
      failed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-gray-500/20 text-gray-400',
    };
    return statusMap[status] || 'bg-slate-500/20 text-slate-400';
  };

  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, string> = {
      confirmed: '✅',
      pending: '⏳',
      failed: '❌',
      cancelled: '🚫',
    };
    return iconMap[status] || '❓';
  };

  return (
    <Card 
      hover 
      className={cn(
        'border-slate-700 hover:border-purple-400/50 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getStatusIcon(investment.status)}</span>
            <div>
              {showProject && projectName && (
                <Link 
                  href={`/projects/${investment.project_id}`}
                  className="text-sm font-medium text-purple-400 hover:text-purple-300"
                >
                  {projectName}
                </Link>
              )}
              <div className="text-xs text-slate-400 mt-0.5">
                {formatDate(investment.investment_date)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(investment.status)} size="sm">
              {investment.status.toUpperCase()}
            </Badge>
            <TierBadge 
              tierLevel={investment.tier_at_investment} 
              size="sm" 
              variant="minimal" 
            />
          </div>
        </div>
      </div>

      {/* Investment Details */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Amount Invested</p>
            <p className="text-lg font-bold text-cyan-400">
              {formatXRP(investment.amount_xrp)} XRP
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Tokens Received</p>
            <p className="text-lg font-bold text-yellow-400">
              {formatXRP(investment.tokens_received)}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="bg-slate-800/30 rounded-lg p-2">
            <p className="text-slate-400 text-xs mb-1">Price per Token</p>
            <p className="text-sm font-medium text-white">
              {investment.price_per_token} XRP
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-2">
            <p className="text-slate-400 text-xs mb-1">Value</p>
            <p className="text-sm font-medium text-green-400">
              {formatXRP(investment.tokens_received * investment.price_per_token)} XRP
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Info */}
      {investment.transaction_hash && (
        <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Transaction:</span>
            <a
              href={`https://xrpl.org/tx/${investment.transaction_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 font-mono"
            >
              {investment.transaction_hash.slice(0, 8)}...{investment.transaction_hash.slice(-8)}
            </a>
          </div>
          {investment.confirmed_date && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-400">Confirmed:</span>
              <span className="text-xs text-slate-300">
                {formatDate(investment.confirmed_date)}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}