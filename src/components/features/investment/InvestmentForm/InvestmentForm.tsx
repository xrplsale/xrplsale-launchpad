'use client';

import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { TierBadge } from '@/components/features/user';
import { cn, formatXRP, getTierInfo } from '@/lib/utils';
import type { Project, User } from '@/types';

interface InvestmentFormProps {
  project: Project;
  user?: User;
  className?: string;
  onInvest?: (amount: number) => Promise<void>;
}

export function InvestmentForm({ 
  project, 
  user,
  className,
  onInvest 
}: InvestmentFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const userTier = user ? getTierInfo(user.tier_level) : getTierInfo(0);
  const maxAllocation = user ? user.guaranteed_allocation * userTier.max_investment_multiplier : parseFloat(project.max_investment);
  const minInvestment = parseFloat(project.min_investment);
  const numericAmount = parseFloat(amount) || 0;
  const tokensToReceive = numericAmount / parseFloat(project.price_per_token);

  const validateAmount = (value: number): string[] => {
    const errors: string[] = [];
    
    if (value < minInvestment) {
      errors.push(`Minimum investment is ${formatXRP(minInvestment)} XRP`);
    }
    
    if (value > maxAllocation) {
      errors.push(`Maximum allocation for your tier is ${formatXRP(maxAllocation)} XRP`);
    }

    if (value > parseFloat(project.max_investment)) {
      errors.push(`Maximum investment per user is ${formatXRP(parseFloat(project.max_investment))} XRP`);
    }

    return errors;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setErrors({});
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const validationErrors = validateAmount(numValue);
      if (validationErrors.length > 0) {
        setErrors({ amount: validationErrors[0] });
      }
    }
  };

  const handleInvest = async () => {
    if (!onInvest || !numericAmount) return;

    const validationErrors = validateAmount(numericAmount);
    if (validationErrors.length > 0) {
      setErrors({ amount: validationErrors[0] });
      return;
    }

    setIsLoading(true);
    try {
      await onInvest(numericAmount);
      setAmount('');
    } catch {
      setErrors({ submit: 'Investment failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [
    { label: 'Min', value: minInvestment },
    { label: '25%', value: maxAllocation * 0.25 },
    { label: '50%', value: maxAllocation * 0.5 },
    { label: 'Max', value: maxAllocation }
  ];

  return (
    <Card className={cn(
      'border-purple-400/20 bg-gradient-to-br from-slate-800/70 to-purple-900/10',
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Invest in {project.name}</h3>
          {user && (
            <TierBadge 
              tierLevel={user.tier_level} 
              size="sm" 
              showMultiplier 
            />
          )}
        </div>

        {/* Investment Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Token Price</p>
            <p className="text-lg font-bold text-yellow-400">
              {project.price_per_token} XRP
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Your Max Allocation</p>
            <p className="text-lg font-bold text-green-400">
              {formatXRP(maxAllocation)} XRP
            </p>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Investment Amount (XRP)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount in XRP"
              min={minInvestment}
              max={maxAllocation}
              step="0.01"
              className={cn(
                'w-full px-4 py-3 bg-slate-800/50 border rounded-lg',
                'text-white placeholder-slate-400 focus:outline-none focus:ring-2',
                errors.amount 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-slate-600 focus:ring-purple-400'
              )}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
              XRP
            </div>
          </div>
          {errors.amount && (
            <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {quickAmounts.map((quick) => (
            <Button
              key={quick.label}
              variant="outline"
              size="sm"
              onClick={() => handleAmountChange(quick.value.toString())}
              className="text-xs"
            >
              {quick.label}
            </Button>
          ))}
        </div>

        {/* Investment Preview */}
        {numericAmount > 0 && (
          <div className="bg-slate-800/30 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Investment Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-white font-medium">{formatXRP(numericAmount)} XRP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tokens Received:</span>
                <span className="text-yellow-400 font-medium">{formatXRP(tokensToReceive)} {project.symbol}</span>
              </div>
              {user && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Tier Multiplier:</span>
                  <span className="text-purple-400 font-medium">{userTier.multiplier}x</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Invest Button */}
        <Button
          onClick={handleInvest}
          disabled={isLoading || !numericAmount || !!errors.amount || project.status !== 'live'}
          loading={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          {project.status !== 'live' 
            ? 'Sale Not Active' 
            : `Invest ${numericAmount ? formatXRP(numericAmount) + ' XRP' : ''}`
          }
        </Button>

        {errors.submit && (
          <p className="text-red-400 text-sm mt-2 text-center">{errors.submit}</p>
        )}

        {/* Investment Limits */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Min: {formatXRP(minInvestment)} XRP</span>
            <span>Max: {formatXRP(maxAllocation)} XRP</span>
          </div>
        </div>
      </div>
    </Card>
  );
}