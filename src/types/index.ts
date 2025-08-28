/**
 * Global Type Definitions
 * Extends the API types with additional UI-specific types
 */

// Re-export API types
export type {
  Project,
  XRPLStats,
  PresaleStatus,
  APIResponse,
} from '@/lib/api-simple';

// Re-export Blog types
export type {
  BlogArticle,
  BlogCategory,
  BlogListResponse,
  BlogSearchParams,
  RelatedArticle,
} from './blog';

// UI Component Types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BaseComponentProps extends ComponentProps {
  id?: string;
  'data-testid'?: string;
}

// Layout Types
export interface LayoutProps extends ComponentProps {
  title?: string;
  description?: string;
  showNav?: boolean;
  showFooter?: boolean;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// Form Types
export interface FormFieldError {
  message: string;
  type: 'required' | 'invalid' | 'custom';
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<keyof T, FormFieldError | null>;
  touched: Record<keyof T, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Investment Types (extending API types)
export interface InvestmentFormData {
  amount: number;
  acceptTerms: boolean;
  walletAddress?: string;
}

export interface InvestmentTransaction {
  id: string;
  projectId: number;
  amount: number;
  tokensReceived: number;
  tier: number;
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  timestamp: string;
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  external?: boolean;
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

// Modal Types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

// Toast/Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  id?: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
  lastUpdated?: Date;
}

export interface AsyncData<T> extends LoadingState {
  data?: T;
}

// Chart/Stats Types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface StatsMetric {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
}

// Search/Filter Types
export interface SearchFilters {
  query?: string;
  status?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  sortBy?: 'name' | 'price' | 'progress' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Feature Flags
export interface FeatureFlags {
  darkMode: boolean;
  newDashboard: boolean;
  advancedCharts: boolean;
  socialLogin: boolean;
  mobileApp: boolean;
}

// User Types (matching Flask User model)
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  walletAddress?: string;
  // Flask-specific user fields
  kyc_status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  platform_token_balance: number;
  tier_level: number;
  early_access_hours: number;
  guaranteed_allocation: number;
  // UI preferences
  preferences: {
    theme: ThemeMode;
    notifications: boolean;
    newsletter: boolean;
  };
  createdAt: string;
  lastActive: string;
}

// Tier System Types (matching Flask tier system)
export interface TierInfo {
  tier_number: number;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  multiplier: number;
  min_tokens_required: number;
  early_access_hours: number;
  guaranteed_allocation_percentage: number;
  max_investment_multiplier: number;
  benefits: string[];
  color_scheme: {
    primary: string;
    secondary: string;
    gradient: string;
  };
}

// Investment Types (matching Flask Investment model)
export interface Investment {
  id: string;
  user_id: string;
  project_id: number;
  amount_xrp: number;
  tokens_received: number;
  tier_at_investment: number;
  price_per_token: number;
  transaction_hash?: string;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  investment_date: string;
  confirmed_date?: string;
  // Additional metadata
  escrow_sequence?: number;
  escrow_destination_tag?: number;
}

export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

// Event Handler Types
export type ClickHandler = (event: React.MouseEvent) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type SubmitHandler<T = Record<string, unknown>> = (data: T) => Promise<void> | void;

// Route Types
export interface RouteParams {
  id?: string;
  slug?: string;
  [key: string]: string | undefined;
}

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

// Component Variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type Orientation = 'horizontal' | 'vertical';
export type Alignment = 'left' | 'center' | 'right';
export type Position = 'top' | 'bottom' | 'left' | 'right';

// API Status Types
export type APIStatus = 'idle' | 'loading' | 'success' | 'error';

export interface APIState<T = unknown> {
  status: APIStatus;
  data?: T;
  error?: string;
}

// Changelog Types
export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description?: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  category: 'feature' | 'improvement' | 'bugfix' | 'security' | 'breaking';
  changes: ChangelogItem[];
  author?: string;
  pull_request?: number;
  commit_hash?: string;
}

export interface ChangelogItem {
  id: string;
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  title: string;
  description: string;
  component?: string;
  breaking_change?: boolean;
  migration_notes?: string;
  related_issues?: number[];
}

export interface ChangelogFilters {
  version?: string;
  type?: ChangelogEntry['type'][];
  category?: ChangelogEntry['category'][];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ChangelogListResponse {
  entries: ChangelogEntry[];
  total: number;
  page: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
  versions: string[];
}