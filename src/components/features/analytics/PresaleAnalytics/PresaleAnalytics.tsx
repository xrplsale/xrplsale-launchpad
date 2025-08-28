'use client';

import { useEffect, useState } from 'react';
import { getPresaleAnalytics, type PresaleAnalytics } from '@/lib/api-simple';

export default function PresaleAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<PresaleAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getPresaleAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-600 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-20 bg-slate-600 rounded"></div>
            <div className="h-20 bg-slate-600 rounded"></div>
            <div className="h-20 bg-slate-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="text-center text-slate-400">
          <p>{error || 'No analytics data available'}</p>
        </div>
      </div>
    );
  }

  const { presale_overview, contribution_stats, tier_distribution, temporal_analytics, whale_analytics, performance_metrics } = analytics;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Presale Analytics</h2>
        
        {/* Presale Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm">Total Raised</h3>
            <p className="text-2xl font-bold text-green-400">{presale_overview.total_raised_xrp.toFixed(2)} XRP</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm">Investors</h3>
            <p className="text-2xl font-bold text-blue-400">{presale_overview.total_investors}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm">Current Tier</h3>
            <p className="text-2xl font-bold text-purple-400">{presale_overview.current_tier}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm">Current Price</h3>
            <p className="text-2xl font-bold text-yellow-400">{presale_overview.current_price.toFixed(3)} XRP</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400">Presale Progress</span>
            <span className="text-white font-medium">{presale_overview.presale_progress.toFixed(4)}%</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(presale_overview.presale_progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Contribution Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm">Total Contributions</h3>
            <p className="text-2xl font-bold text-white">{contribution_stats.total_contributions}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm">Average Contribution</h3>
            <p className="text-2xl font-bold text-blue-400">{contribution_stats.average_contribution.toFixed(2)} XRP</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-slate-400 text-sm">Largest Contribution</h3>
            <p className="text-2xl font-bold text-green-400">{contribution_stats.largest_contribution.toFixed(2)} XRP</p>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">Tier Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(tier_distribution).map(([tier, data]) => (
              <div key={tier} className="bg-slate-700 rounded-lg p-4">
                <h4 className="text-slate-400 text-sm">{tier} Tier</h4>
                <p className="text-lg font-bold text-white">{data.count} users</p>
                <p className="text-sm text-slate-300">{data.percentage.toFixed(1)}%</p>
                <p className="text-sm text-purple-400">{data.total_tokens.toFixed(0)} tokens</p>
              </div>
            ))}
          </div>
        </div>

        {/* Temporal Analytics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Daily Activity 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              temporal_analytics.trend === 'increasing' ? 'bg-green-600' : 
              temporal_analytics.trend === 'decreasing' ? 'bg-red-600' : 
              'bg-yellow-600'
            }`}>
              {temporal_analytics.trend}
            </span>
          </h3>
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-2">
              {temporal_analytics.daily_contributions.slice(-7).map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-slate-400 mb-1">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="bg-slate-600 rounded p-2">
                    <div className="text-sm font-semibold text-white">{day.count}</div>
                    <div className="text-xs text-slate-300">{day.amount.toFixed(0)} XRP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Whale Analytics */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Whale Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-sm">Whale Count</h4>
              <p className="text-xl font-bold text-yellow-400">{whale_analytics.whale_count}</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-sm">Whale Percentage</h4>
              <p className="text-xl font-bold text-yellow-400">{whale_analytics.whale_percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-sm">Whale Contribution</h4>
              <p className="text-xl font-bold text-yellow-400">{whale_analytics.whale_total_contribution.toFixed(2)} XRP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}