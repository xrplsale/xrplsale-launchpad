'use client';

import { useEffect, useState } from 'react';
import { StatsCard } from '@/components/features/stats/StatsCard';
import { formatXRP, formatNumber } from '@/lib/utils';
import { getXRPLStats } from '@/lib/api-simple';
import type { XRPLStats } from '@/lib/api-simple';

interface XRPLDashboardProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function XRPLDashboard({ 
  className, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: XRPLDashboardProps) {
  const [stats, setStats] = useState<XRPLStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const data = await getXRPLStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load XRPL stats');
      console.error('Failed to fetch XRPL stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    if (autoRefresh) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Network Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">XRPL Network Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            variant="glass"
            title="Ledger Index"
            value={stats?.network.ledger_index.toLocaleString() || '-'}
            subtitle="Current ledger"
            icon="📊"
            loading={loading}
          />
          <StatsCard
            variant="glass"
            title="Validated Ledger"
            value={stats?.network.validated_ledger_index.toLocaleString() || '-'}
            subtitle="Last validated"
            icon="⚡"
            loading={loading}
          />
          <StatsCard
            variant="glass"
            title="Base Reserve"
            value={stats ? `${stats.network.reserve_base_xrp} XRP` : '-'}
            subtitle="Account reserve"
            icon="💰"
            loading={loading}
          />
          <StatsCard
            variant="glass"
            title="Owner Reserve"
            value={stats ? `${stats.network.reserve_inc_xrp} XRP` : '-'}
            subtitle="Per object"
            icon="🔒"
            loading={loading}
          />
        </div>
      </div>

      {/* Market Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Market Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            variant="glass"
            title="XRP Price"
            value={stats ? `$${stats.market.xrp_price_usd.toFixed(4)}` : '-'}
            subtitle="Current price"
            icon="💎"
            trend={stats ? {
              value: stats.market.change_24h,
              type: stats.market.change_24h > 0 ? 'increase' : 'decrease',
              period: '24h'
            } : undefined}
            loading={loading}
          />
          <StatsCard
            variant="glass"
            title="Market Cap"
            value={stats ? `$${formatNumber(stats.market.market_cap)}` : '-'}
            subtitle="Total market cap"
            icon="💰"
            loading={loading}
          />
          <StatsCard
            variant="glass"
            title="24h Volume"
            value={stats ? `$${formatNumber(stats.market.volume_24h)}` : '-'}
            subtitle="Trading volume"
            icon="📈"
            loading={loading}
          />
          <StatsCard
            variant="glass"
            title="24h Change"
            value={stats ? `${stats.market.change_24h.toFixed(2)}%` : '-'}
            subtitle="Price change"
            icon={stats && stats.market.change_24h > 0 ? '📈' : '📉'}
            loading={loading}
          />
        </div>
      </div>

      {/* Platform Stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Platform Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            variant="highlighted"
            title="Total Projects"
            value={stats?.platform.total_projects.toString() || '-'}
            subtitle="All time"
            icon="🚀"
            loading={loading}
          />
          <StatsCard
            variant="highlighted"
            title="Active Projects"
            value={stats?.platform.active_projects.toString() || '-'}
            subtitle="Currently fundraising"
            icon="🔥"
            loading={loading}
          />
          <StatsCard
            variant="highlighted"
            title="Total Raised"
            value={stats ? `${formatXRP(stats.platform.total_raised_xrp)} XRP` : '-'}
            subtitle="Platform lifetime"
            icon="💰"
            loading={loading}
          />
          <StatsCard
            variant="highlighted"
            title="Total Users"
            value={stats?.platform.total_users.toLocaleString() || '-'}
            subtitle="Registered users"
            icon="👥"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}