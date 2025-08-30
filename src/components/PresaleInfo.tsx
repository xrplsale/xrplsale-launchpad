import Link from 'next/link';
import { PresaleStatus } from '@/lib/api-simple';
import { ProgressRing, AnimatedCounter, formatters } from '@/components/ui';

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
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 border border-slate-600 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* Left Side - Progress Ring */}
          <div className="flex flex-col items-center justify-center">
            <ProgressRing
              progress={progress}
              size={200}
              strokeWidth={12}
              color="gradient"
              startOnView={true}
              className="mb-4"
            >
              <div className="text-center">
                <AnimatedCounter
                  value={progress}
                  className="text-2xl font-bold text-white"
                  formatNumber={formatters.percentage}
                  startOnView={true}
                  duration={2000}
                />
                <div className="text-xs text-slate-400 mt-1">Complete</div>
              </div>
            </ProgressRing>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  presaleStatus.is_active 
                    ? 'bg-green-500/20 text-green-400 animate-pulse-gentle' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {presaleStatus.is_active ? 'Live' : 'Ended'}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                <AnimatedCounter
                  value={parseFloat(presaleStatus.tokens_sold || '0')}
                  className="text-cyan-400 font-medium"
                  formatNumber={formatters.compact}
                  startOnView={true}
                  delay={500}
                />
                {' of '}
                <AnimatedCounter
                  value={parseFloat(presaleStatus.total_supply || '0')}
                  className="text-purple-400 font-medium"
                  formatNumber={formatters.compact}
                  startOnView={true}
                  delay={700}
                />
                {' XSALE sold'}
              </div>
            </div>
          </div>

          {/* Middle - Statistics */}
          <div className="flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Presale Statistics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 hover:border-cyan-400/50 transition-colors">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  <AnimatedCounter
                    value={presaleStatus.current_tier || 1}
                    className="text-2xl font-bold text-cyan-400"
                    prefix="Tier "
                    startOnView={true}
                    delay={1000}
                  />
                </div>
                <div className="text-xs text-slate-400">Current Tier</div>
              </div>
              
              <div className="text-center p-4 rounded-xl bg-slate-700/50 backdrop-blur-sm border border-slate-600/50 hover:border-purple-400/50 transition-colors">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  <AnimatedCounter
                    value={presaleStatus.participants_count || 0}
                    className="text-2xl font-bold text-purple-400"
                    formatNumber={formatters.compact}
                    startOnView={true}
                    delay={1200}
                  />
                </div>
                <div className="text-xs text-slate-400">Participants</div>
              </div>
            </div>
            
            {/* Next Tier Info */}
            {presaleStatus.next_tier_threshold && (
              <div className="text-center p-3 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-700/80 border border-slate-600/50 backdrop-blur-sm">
                <div className="text-xs text-slate-400 mb-1">Next tier at:</div>
                <div className="text-sm font-semibold text-cyan-400">
                  <AnimatedCounter
                    value={parseFloat(presaleStatus.next_tier_threshold)}
                    className="text-sm font-semibold text-cyan-400"
                    formatNumber={formatters.compact}
                    suffix=" XSALE"
                    startOnView={true}
                    delay={1400}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Pricing & Action */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Price Display */}
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-slate-700/80 to-slate-600/80 border border-slate-500/50 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-sm text-slate-400 mb-2">Current Price</div>
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter
                    value={parseFloat(presaleStatus.current_price || '0.001')}
                    className="text-3xl font-bold text-white"
                    formatNumber={formatters.xrp}
                    suffix=" XRP"
                    startOnView={true}
                    delay={1600}
                  />
                </div>
                <div className="text-xs text-slate-400">per XSALE token</div>
              </div>
            </div>

            {/* Time Remaining */}
            {presaleStatus.time_remaining > 0 && (
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/30 backdrop-blur-sm animate-glow-pulse">
                <div className="text-sm text-orange-400 mb-1">Time Remaining</div>
                <div className="text-lg font-semibold text-orange-300">
                  <AnimatedCounter
                    value={Math.floor(presaleStatus.time_remaining / 86400)}
                    className="text-lg font-semibold text-orange-300"
                    suffix="d"
                    startOnView={true}
                    delay={1800}
                  />
                  {' '}
                  <AnimatedCounter
                    value={Math.floor((presaleStatus.time_remaining % 86400) / 3600)}
                    className="text-lg font-semibold text-orange-300"
                    suffix="h"
                    startOnView={true}
                    delay={2000}
                  />
                </div>
              </div>
            )}

            {/* Enhanced Action Button */}
            <Link
              href="/projects/0"
              className="group block w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-size-200 hover:bg-pos-100 text-white text-center py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 animate-gradient-shift relative overflow-hidden"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {presaleStatus.is_active ? (
                  <>
                    <span>🚀</span>
                    <span>Join Presale Now</span>
                  </>
                ) : (
                  <>
                    <span>👁️</span>
                    <span>View Details</span>
                  </>
                )}
              </span>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl p-px bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}