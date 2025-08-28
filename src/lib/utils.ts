import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format XRP amounts with proper decimals
 */
export function formatXRP(amount: number | string, decimals: number = 2): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format numbers with K, M, B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format percentage with proper decimals
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    live: 'bg-green-500/20 text-green-400',
    active: 'bg-green-500/20 text-green-400',
    upcoming: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-gray-500/20 text-gray-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    cancelled: 'bg-red-500/20 text-red-400',
    draft: 'bg-purple-500/20 text-purple-400',
  };
  
  return statusMap[String(status).toLowerCase()] || 'bg-slate-500/20 text-slate-400';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Calculate days between dates
 */
export function daysBetween(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if date is in the past
 */
export function isDatePast(date: string | Date): boolean {
  return new Date(date) < new Date();
}

/**
 * Format date in a user-friendly way
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Date(date).toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Tier System Constants and Utilities (matching Flask backend)
 */
import type { TierInfo } from '@/types';

export const TIER_CONFIGURATIONS: Record<number, TierInfo> = {
  0: {
    tier_number: 0,
    name: 'Bronze',
    multiplier: 1.0,
    min_tokens_required: 0,
    early_access_hours: 0,
    guaranteed_allocation_percentage: 10,
    max_investment_multiplier: 1.0,
    benefits: ['Basic access to presales', 'Standard allocation priority'],
    color_scheme: {
      primary: '#CD7F32',
      secondary: '#B87333',
      gradient: 'from-amber-600 to-amber-800'
    }
  },
  1: {
    tier_number: 1,
    name: 'Silver',
    multiplier: 1.5,
    min_tokens_required: 1000,
    early_access_hours: 2,
    guaranteed_allocation_percentage: 20,
    max_investment_multiplier: 1.5,
    benefits: ['2 hours early access', '1.5x investment multiplier', 'Priority support'],
    color_scheme: {
      primary: '#C0C0C0',
      secondary: '#A8A8A8',
      gradient: 'from-slate-300 to-slate-500'
    }
  },
  2: {
    tier_number: 2,
    name: 'Gold',
    multiplier: 2.0,
    min_tokens_required: 5000,
    early_access_hours: 6,
    guaranteed_allocation_percentage: 35,
    max_investment_multiplier: 2.0,
    benefits: ['6 hours early access', '2x investment multiplier', 'Exclusive project insights'],
    color_scheme: {
      primary: '#FFD700',
      secondary: '#FFC125',
      gradient: 'from-yellow-400 to-yellow-600'
    }
  },
  3: {
    tier_number: 3,
    name: 'Platinum',
    multiplier: 3.0,
    min_tokens_required: 15000,
    early_access_hours: 12,
    guaranteed_allocation_percentage: 50,
    max_investment_multiplier: 3.0,
    benefits: ['12 hours early access', '3x investment multiplier', 'Private community access', 'Direct team communication'],
    color_scheme: {
      primary: '#E5E4E2',
      secondary: '#D1D0CE',
      gradient: 'from-gray-300 to-gray-400'
    }
  },
  4: {
    tier_number: 4,
    name: 'Diamond',
    multiplier: 5.0,
    min_tokens_required: 50000,
    early_access_hours: 24,
    guaranteed_allocation_percentage: 75,
    max_investment_multiplier: 5.0,
    benefits: ['24 hours early access', '5x investment multiplier', 'VIP treatment', 'Project advisory opportunities', 'Exclusive events'],
    color_scheme: {
      primary: '#B9F2FF',
      secondary: '#8ED1FC',
      gradient: 'from-cyan-200 to-blue-400'
    }
  }
};

export function getTierInfo(tierLevel: number): TierInfo {
  return TIER_CONFIGURATIONS[tierLevel] || TIER_CONFIGURATIONS[0];
}

export function getTierByTokens(tokenBalance: number): TierInfo {
  const tiers = Object.values(TIER_CONFIGURATIONS).reverse(); // Start from highest tier
  return tiers.find(tier => tokenBalance >= tier.min_tokens_required) || TIER_CONFIGURATIONS[0];
}

export function getTierColor(tierLevel: number): string {
  const tier = getTierInfo(tierLevel);
  return tier.color_scheme.primary;
}

export function getTierGradient(tierLevel: number): string {
  const tier = getTierInfo(tierLevel);
  return tier.color_scheme.gradient;
}