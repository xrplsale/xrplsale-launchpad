/**
 * Design System Theme Configuration
 * Centralized color palette and styling constants
 */

// Color Palette
export const colors = {
  // Background
  background: {
    primary: '#0f172a', // slate-900
    secondary: '#1e293b', // slate-800
    tertiary: '#334155', // slate-700
    card: 'rgba(30, 41, 59, 0.5)', // slate-800/50
    elevated: 'rgba(30, 41, 59, 0.7)', // slate-800/70
    glass: 'rgba(30, 41, 59, 0.3)', // slate-800/30
  },
  
  // Text
  text: {
    primary: '#f8fafc', // slate-50
    secondary: '#cbd5e1', // slate-300
    tertiary: '#94a3b8', // slate-400
    muted: '#64748b', // slate-500
  },
  
  // Brand Colors (matching Flask backend)
  brand: {
    primary: {
      from: '#9333ea', // purple-600
      to: '#db2777', // pink-600
      solid: '#9333ea',
    },
    secondary: {
      from: '#06b6d4', // cyan-500
      to: '#3b82f6', // blue-500
      solid: '#06b6d4',
    },
    // XRPL Brand Colors
    xrpl: {
      primary: '#000000', // XRPL Black
      secondary: '#23292f', // XRPL Dark Gray
      accent: '#00d4aa', // XRPL Green
    },
  },
  
  // Semantic Colors
  semantic: {
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#ef4444', // red-500
    info: '#3b82f6', // blue-500
  },
  
  // Status Colors
  status: {
    live: '#10b981', // emerald-500
    active: '#10b981', // emerald-500
    upcoming: '#3b82f6', // blue-500
    completed: '#6b7280', // gray-500
    paused: '#f59e0b', // amber-500
    cancelled: '#ef4444', // red-500
    draft: '#8b5cf6', // violet-500
  },
  
  // Border
  border: {
    default: '#475569', // slate-600
    muted: '#374151', // slate-700
    accent: '#8b5cf6', // violet-500
  },
} as const;

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
    mono: ['var(--font-geist-mono)', 'monospace'],
  },
  
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// Spacing Scale
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
  '5xl': '8rem', // 128px
} as const;

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// Breakpoints
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Animation Durations
export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Component Variants
export const variants = {
  button: {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    secondary: 'border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900',
    ghost: 'text-slate-300 hover:bg-slate-800/50 hover:text-white',
    outline: 'border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white',
  },
  
  card: {
    default: 'bg-slate-800/50 border-slate-700',
    elevated: 'bg-slate-800/70 border-slate-600 shadow-xl',
    outlined: 'bg-transparent border-slate-600',
    glass: 'bg-slate-800/30 border-slate-700/50 backdrop-blur-sm',
  },
  
  badge: {
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    pink: 'bg-pink-500/20 text-pink-400',
    cyan: 'bg-cyan-500/20 text-cyan-400',
  },
} as const;

// Utility Functions
export function getGradient(from: string, to: string): string {
  return `linear-gradient(135deg, ${from}, ${to})`;
}

export function withOpacity(color: string, opacity: number): string {
  return `${color}/${Math.round(opacity * 100)}`;
}

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  animation,
  variants,
  getGradient,
  withOpacity,
} as const;

export default theme;