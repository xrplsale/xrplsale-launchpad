import Link from 'next/link';
import { PresaleStatus } from '@/lib/api-simple';

interface PresaleInfoProps {
  presaleStatus: PresaleStatus;
}

export default function PresaleInfo({ presaleStatus }: PresaleInfoProps) {
  const progress = presaleStatus.tokens_sold && presaleStatus.total_supply 
    ? (parseFloat(presaleStatus.tokens_sold) / parseFloat(presaleStatus.total_supply)) * 100 
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Presale Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Current Progress</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                presaleStatus.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {presaleStatus.is_active ? 'Active' : 'Ended'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-slate-300 mb-2">
                <span>Tokens Sold</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{presaleStatus.tokens_sold || '0'} XSALE</span>
                <span>{presaleStatus.total_supply || '0'} Total</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  Tier {presaleStatus.current_tier || 1}
                </div>
                <div className="text-sm text-slate-400">Current Tier</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {presaleStatus.participants_count || 0}
                </div>
                <div className="text-sm text-slate-400">Participants</div>
              </div>
            </div>
          </div>

          {/* Right Side - Pricing & Action */}
          <div>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-white mb-2">
                {presaleStatus.current_price || '0.001'} XRP
              </div>
              <div className="text-slate-400">per XSALE token</div>
            </div>

            {/* Time Remaining */}
            {presaleStatus.time_remaining > 0 && (
              <div className="text-center mb-6 p-4 bg-slate-700/50 rounded-lg">
                <div className="text-lg font-semibold text-orange-400 mb-1">
                  {Math.floor(presaleStatus.time_remaining / 86400)}d {Math.floor((presaleStatus.time_remaining % 86400) / 3600)}h
                </div>
                <div className="text-sm text-slate-400">Time Remaining</div>
              </div>
            )}

            {/* Next Tier Info */}
            {presaleStatus.next_tier_threshold && (
              <div className="text-center mb-6 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                <div className="text-sm text-slate-400 mb-1">Next tier at:</div>
                <div className="text-lg font-semibold text-cyan-400">
                  {presaleStatus.next_tier_threshold} XSALE
                </div>
              </div>
            )}

            {/* Action Button */}
            <Link
              href="/projects/0"
              className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-center py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              {presaleStatus.is_active ? 'Join Presale' : 'View Details'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}