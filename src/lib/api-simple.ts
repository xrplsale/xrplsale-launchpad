/**
 * Simple API Client for XRPL.Sale
 * Clean, production-ready API handling with logging
 */

import { logger } from './logger-simple';
import type { 
  BlogArticle, 
  BlogCategory, 
  BlogListResponse, 
  BlogSearchParams,
  RelatedArticle 
} from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  xrpl_address?: string;
  kyc_status: 'pending' | 'verified' | 'rejected';
  platform_token_balance: string;
  tier_level: string;
  tier_multiplier: number;
  early_access_hours: number;
  guaranteed_allocation: boolean;
  created_at: string;
}

export interface Project {
  id: number;
  name: string;
  symbol: string;
  description: string;
  website?: string;
  whitepaper_url?: string;
  audit_report_url?: string;
  token_address?: string;
  token_currency_code?: string;
  total_supply: string;
  price_per_token: string;
  min_investment: string;
  max_investment: string;
  sale_start: string;
  sale_end: string;
  target_amount: string;
  raised_amount: string;
  dex_trading_pair?: string;
  initial_dex_liquidity?: string;
  status: 'draft' | 'auditing' | 'live' | 'completed' | 'cancelled';
  escrow_address: string;
  escrow_condition?: string;
  escrow_finish_after?: string;
  team_commitment_percentage: number;
  creator_id: number;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: number;
  amount: string;
  tokens_received: string;
  investment_date: string;
  transaction_hash?: string;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  user_id: number;
  project_id: number;
}

export interface XRPLStats {
  network: {
    ledger_index: number;
    ledger_time: string;
    reserve_base_xrp: number;
    reserve_inc_xrp: number;
    validated_ledger_index: number;
  };
  market: {
    xrp_price_usd: number;
    market_cap: number;
    volume_24h: number;
    change_24h: number;
  };
  platform: {
    total_projects: number;
    active_projects: number;
    total_raised_xrp: number;
    total_users: number;
  };
}

export interface PresaleStatus {
  is_active: boolean;
  current_tier: number;
  current_price: string;
  tokens_sold: string;
  total_supply: string;
  next_tier_threshold: string;
  time_remaining: number;
  participants_count: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  session_token?: string;
  message?: string;
}

export interface AccountInfo {
  account_data: {
    Account: string;
    Balance: string;
    Flags: number;
    LedgerEntryType: string;
    OwnerCount: number;
    PreviousTxnID: string;
    PreviousTxnLgrSeq: number;
    Sequence: number;
    index: string;
  };
  recent_transactions: Array<{
    transaction: any;
    meta: any;
    validated: boolean;
  }>;
  trustlines: Array<{
    currency: string;
    issuer: string;
    balance: string;
    limit: string;
  }>;
}

export interface PresaleAnalytics {
  presale_overview: {
    total_raised_xrp: number;
    total_investors: number;
    current_tier: number;
    current_price: number;
    tokens_distributed: number;
    presale_progress: number;
  };
  contribution_stats: {
    total_contributions: number;
    average_contribution: number;
    median_contribution: number;
    largest_contribution: number;
    smallest_contribution: number;
    contribution_distribution: {[key: string]: number};
  };
  tier_distribution: {
    [key: string]: {
      count: number;
      percentage: number;
      total_tokens: number;
    };
  };
  temporal_analytics: {
    daily_contributions: Array<{
      date: string;
      count: number;
      amount: number;
    }>;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  whale_analytics: {
    whale_count: number;
    whale_percentage: number;
    whale_total_contribution: number;
  };
  performance_metrics: {
    daily_average_xrp: number;
    days_elapsed: number;
    momentum: string;
  };
  last_updated: string;
}

// Landing Content (JSON) for marketing/landing page
export interface LandingCTA {
  label: string;
  href: string;
}

export interface LandingHero {
  title: string;
  subtitle?: string;
  primaryCta?: LandingCTA;
  secondaryCta?: LandingCTA;
}

export interface LandingFeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface LandingStatsBlock {
  total_projects?: number;
  active_projects?: number;
  total_users?: number;
  total_raised_xrp?: number;
  platform_version?: string;
}

export interface LandingContent {
  hero: LandingHero;
  features?: LandingFeatureItem[];
  stats?: LandingStatsBlock;
  faq?: Array<{ q: string; a: string }>;
  popularSearches?: string[];
  presale?: {
    is_active: boolean;
    current_tier: number;
    current_price: string;
    total_raised: number;
    tier_goal: number;
    tier_progress: number;
    tokens_sold: string;
    total_supply: string;
    sale_end_timestamp: number;
    project_url?: string;
  };
  updated_at?: string;
}

// API Response wrapper
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const requestId = Math.random().toString(36).substr(2, 9);
    
    logger.api('info', `API Request: ${options.method || 'GET'} ${endpoint}`, {
      requestId,
      url,
      headers: options.headers
    });

    const startTime = performance.now();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      logger.api('info', `API Response: ${endpoint} completed`, {
        requestId,
        status: response.status,
        duration: Math.round(duration),
        dataSize: JSON.stringify(data).length
      });

      return data;

    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      logger.api('error', `API Request failed: ${endpoint}`, {
        requestId,
        duration: Math.round(duration),
        url
      }, error as Error);

      throw error;
    }
  }

  private async requestNextJS<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Client: use window origin; Server: use absolute origin to avoid relative URL parse errors
    const isClient = typeof window !== 'undefined';
    const serverOrigin = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const url = isClient ? `${window.location.origin}${endpoint}` : `${serverOrigin}${endpoint}`;
    const requestId = Math.random().toString(36).substr(2, 9);
    
    logger.api('info', `Next.js API Request: ${options.method || 'GET'} ${endpoint}`, {
      requestId,
      url,
      headers: options.headers
    });

    const startTime = performance.now();

    try {
  // Always use absolute on server, window origin on client
  let response = await fetch(url, {
        ...options,
        // Avoid cache issues on server by default
        cache: options.cache ?? 'no-store',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const dataSize = JSON.stringify(result).length;

      logger.api('info', `API Response: ${endpoint} completed`, {
        requestId,
        status: response.status,
        duration: Math.round(duration),
        dataSize
      });

      // Handle API response format
      if (result.success === false) {
        throw new Error(result.error || result.message || 'API request failed');
      }

      return result.data || result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      logger.api('error', `Next.js API Request failed: ${endpoint}`, {
        requestId,
        duration: Math.round(duration),
  url
      }, error as Error);

      throw error;
    }
  }

  // API Methods
  async getXRPLStats(): Promise<XRPLStats> {
    return this.request<XRPLStats>('/api/v1/xrpl/stats');
  }

  async getPresaleStatus(): Promise<PresaleStatus> {
    return this.request<PresaleStatus>('/api/v1/presale/status');
  }

  async getProjects(): Promise<Project[]> {
    const response = await this.request<{projects: Project[]}>('/api/v1/projects');
    return response.projects || [];
  }

  async getProject(id: string | number): Promise<Project> {
    const response = await this.request<{data: Project}>(`/api/v1/projects/${id}`);
    return response.data;
  }

  async getUser(id: string | number): Promise<User> {
    return this.request<User>(`/api/v1/users/${id}`);
  }

  async getUserInvestments(userId: string | number): Promise<Investment[]> {
    return this.request<Investment[]>(`/api/v1/users/${userId}/investments`);
  }

  async createInvestment(projectId: string | number, amount: string): Promise<Investment> {
    return this.request<Investment>(`/api/v1/projects/${projectId}/invest`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Auth endpoints
  async authenticateWallet(walletAddress: string, signature: string, message: string, publicKey?: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/v1/auth/wallet', {
      method: 'POST',
      body: JSON.stringify({ 
        wallet_address: walletAddress,
        signature,
        message,
        public_key: publicKey 
      }),
    });
  }

  async getSessionInfo(): Promise<User> {
    return this.request<User>('/api/v1/auth/session');
  }

  async logout(): Promise<{success: boolean}> {
    return this.request<{success: boolean}>('/api/v1/auth/logout', {
      method: 'POST',
    });
  }

  async getUserProfile(): Promise<User> {
    return this.request<User>('/api/v1/auth/profile');
  }

  async updateUserProfile(updates: Partial<User>): Promise<User> {
    return this.request<User>('/api/v1/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Presale analytics
  async getPresaleAnalytics(): Promise<PresaleAnalytics> {
    const response = await this.request<{data: PresaleAnalytics}>('/api/v1/presale/analytics');
    return response.data;
  }

  async calculateTierBenefits(tokenAmount: number): Promise<any> {
    return this.request<any>('/api/v1/presale/tier-benefits', {
      method: 'POST',
      body: JSON.stringify({ token_amount: tokenAmount }),
    });
  }

  async contributeToPresale(walletAddress: string, amount: string, txHash?: string): Promise<any> {
    return this.request<any>('/api/v1/presale/contribute', {
      method: 'POST',
      body: JSON.stringify({
        wallet_address: walletAddress,
        amount,
        transaction_hash: txHash,
      }),
    });
  }

  async getUserContributions(walletAddress: string): Promise<any> {
    return this.request<any>(`/api/v1/presale/contributions/${walletAddress}`);
  }

  // Account info
  async getAccountInfo(accountAddress: string): Promise<AccountInfo> {
    return this.request<AccountInfo>(`/api/v1/xrpl/account/${accountAddress}`);
  }

  // Content endpoints
  async getLandingContent(): Promise<LandingContent> {
    return this.request<LandingContent>('/api/content/landing');
  }

  // Blog endpoints (with fallback for development)
  async getBlogArticles(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    tag?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<any> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.category) searchParams.append('category', params.category);
      if (params?.tag) searchParams.append('tag', params.tag);
      if (params?.search) searchParams.append('search', params.search);
      if (params?.featured) searchParams.append('featured', 'true');
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      
      const queryString = searchParams.toString();
      
      // Use Next.js mock API when Flask backend is unavailable or in production
      const useFlaskBackend = process.env.USE_FLASK_BACKEND === 'true' && this.baseURL.includes('127.0.0.1:5000');
      if (!useFlaskBackend) {
        const mockEndpoint = queryString ? `/api/mock/blog/articles?${queryString}` : '/api/mock/blog/articles';
        return this.requestNextJS<any>(mockEndpoint);
      }
      
      const endpoint = queryString ? `/api/v1/blog/articles?${queryString}` : '/api/v1/blog/articles';
      return this.request<any>(endpoint);
    } catch (error) {
      // Return mock data during build/development
      return this.getMockBlogArticles(params);
    }
  }

  async getBlogArticle(slug: string): Promise<any> {
    try {
      // Use Flask backend only when explicitly enabled and available
      const useFlaskBackend = process.env.USE_FLASK_BACKEND === 'true' && this.baseURL.includes('127.0.0.1:5000');
      if (!useFlaskBackend) {
        return await this.requestNextJS<any>(`/api/mock/blog/articles/${slug}`, { cache: 'no-store' });
      }

      return await this.request<any>(`/api/v1/blog/articles/${slug}`);
    } catch (error) {
      // Return mock data during build/development
      const mock = this.getMockBlogArticle(slug);
      // getMockBlogArticle returns { success, data: { article } }
      return (mock as any)?.data?.article ?? mock;
    }
  }

  async getBlogCategories(): Promise<any> {
    try {
      // Use Flask backend only when explicitly enabled and available
      const useFlaskBackend = process.env.USE_FLASK_BACKEND === 'true' && this.baseURL.includes('127.0.0.1:5000');
      if (!useFlaskBackend) {
        return this.requestNextJS<any>('/api/mock/blog/categories');
      }
      
      return this.request<any>('/api/v1/blog/categories');
    } catch (error) {
      return this.getMockBlogCategories();
    }
  }

  async getBlogTags(): Promise<any> {
    try {
      return this.request<any>('/api/v1/blog/tags');
    } catch (error) {
      return this.getMockBlogTags();
    }
  }

  async getBlogFeatured(): Promise<any> {
    try {
      return this.request<any>('/api/v1/blog/featured');
    } catch (error) {
      return this.getMockBlogFeatured();
    }
  }

  async getBlogSitemap(): Promise<any> {
    try {
      return this.request<any>('/api/v1/blog/sitemap');
    } catch (error) {
      return this.getMockBlogSitemap();
    }
  }

  // Mock data methods for development/build
  private getMockBlogArticles(params?: any) {
    const mockArticles = [
      {
        id: 3,
        title: "Revolutionizing Digital Investments: The Power of XRPL and xrpl.sale",
        slug: "revolutionizing-digital-investments-xrpl-xrplsale",
        excerpt: "Discover how XRPL's lightning-fast settlement and xrpl.sale's innovative platform are transforming digital investments for everyone.",
        content: `<h1>Revolutionizing Digital Investments: The Power of XRPL and xrpl.sale</h1>

<p>The financial landscape is undergoing a seismic shift, and at the epicenter of this transformation lies the XRP Ledger (XRPL) – a blockchain network that's redefining what's possible in digital finance. Today, we're excited to share why we built xrpl.sale and how it's making sophisticated blockchain investments accessible to everyone.</p>

<h2>The XRPL Advantage: Why We Chose This Foundation</h2>

<p>When we set out to create the ultimate investment platform for the decentralized era, we didn't just want another cryptocurrency exchange. We wanted to build something that could handle real-world financial demands with the speed, cost-effectiveness, and reliability that traditional finance requires.</p>

<p><strong>The XRP Ledger delivered on every front:</strong></p>

<h3>Lightning-Fast Settlement</h3>
<p>While Bitcoin transactions can take hours and Ethereum can be unpredictable, XRPL consistently settles transactions in 3-5 seconds. This isn't just impressive – it's essential for serious financial applications where timing matters.</p>

<h3>Minimal Transaction Costs</h3>
<p>With fees typically costing fractions of a cent, XRPL removes the cost barriers that make small investments unviable on other networks. Whether you're investing $10 or $10,000, the network fees won't eat into your returns.</p>

<h2>Introducing xrpl.sale: Where Innovation Meets Accessibility</h2>

<p>Our platform isn't just another crypto interface – it's a comprehensive investment ecosystem designed for the modern digital economy.</p>`,
        author: "XRPL.Sale Team",
        author_image: null,
        featured_image: "/images/blog/xrpl-revolution.jpg",
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_published: true,
        is_featured: true,
        category: { id: 1, name: "XRPL Insights", slug: "xrpl-insights", description: "Deep insights into XRPL ecosystem", color: "#6366f1", article_count: 16 },
        tags: ["xrpl", "digital-investment", "platform", "innovation"],
        view_count: 2340,
        read_time_minutes: 12,
        meta_title: "Reinventing Digital Investments with XRPL and xrpl.sale",
        meta_description: "Discover how XRPL's lightning-fast settlement and innovative features make xrpl.sale the future of digital investments.",
        social_image: "/images/blog/xrpl-revolution-social.jpg",
      },
      {
        id: 1,
        title: "Understanding XRPL DEX Trading",
        slug: "understanding-xrpl-dex-trading",
        excerpt: "Learn how to trade efficiently on the XRP Ledger decentralized exchange.",
        content: "<p>The XRP Ledger DEX offers unique advantages...</p>",
        author: "XRPL.Sale Team",
        author_image: null,
        featured_image: "/images/blog/xrpl-dex.jpg",
        published_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        is_published: true,
        is_featured: false,
        category: { id: 1, name: "XRPL Insights", slug: "xrpl-insights", description: "Deep insights into XRPL ecosystem", color: "#6366f1", article_count: 16 },
        tags: ["xrpl", "dex", "trading"],
        view_count: 1250,
        read_time_minutes: 8,
        meta_title: "Understanding XRPL DEX Trading - Complete Guide",
        meta_description: "Complete guide to XRPL DEX trading strategies and best practices.",
        social_image: "/images/blog/xrpl-dex-social.jpg",
      },
      {
        id: 2,
        title: "XRPL.Sale Platform Updates - Q1 2024",
        slug: "xrplsale-platform-updates-q1-2024",
        excerpt: "Exciting new features and improvements coming to the XRPL.Sale platform.",
        content: "<p>We're thrilled to announce several major updates...</p>",
        author: "Development Team",
        author_image: null,
        featured_image: "/images/blog/platform-updates.jpg",
        published_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        is_published: true,
        is_featured: true,
        category: { id: 2, name: "Platform Updates", slug: "platform-updates", description: "Latest platform news and updates", color: "#10b981", article_count: 8 },
        tags: ["platform", "updates", "features"],
        view_count: 892,
        read_time_minutes: 5,
        meta_title: "XRPL.Sale Platform Updates Q1 2024",
        meta_description: "Latest platform updates and new features for XRPL.Sale Q1 2024.",
        social_image: "/images/blog/platform-updates-social.jpg",
      }
    ];

    return {
      success: true,
      data: {
        articles: mockArticles,
        total_count: mockArticles.length,
        page: params?.page || 1,
        per_page: params?.per_page || 10,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      }
    };
  }

  private getMockBlogArticle(slug: string) {
    let mockArticle;
    
    if (slug === "revolutionizing-digital-investments-xrpl-xrplsale") {
      mockArticle = {
        id: 3,
        title: "Revolutionizing Digital Investments: The Power of XRPL and xrpl.sale",
        slug: "revolutionizing-digital-investments-xrpl-xrplsale",
        excerpt: "Discover how XRPL's lightning-fast settlement and xrpl.sale's innovative platform are transforming digital investments for everyone.",
        content: `<h1>Revolutionizing Digital Investments: The Power of XRPL and xrpl.sale</h1>

<p>The financial landscape is undergoing a seismic shift, and at the epicenter of this transformation lies the XRP Ledger (XRPL) – a blockchain network that's redefining what's possible in digital finance. Today, we're excited to share why we built xrpl.sale and how it's making sophisticated blockchain investments accessible to everyone.</p>

<h2>The XRPL Advantage: Why We Chose This Foundation</h2>

<p>When we set out to create the ultimate investment platform for the decentralized era, we didn't just want another cryptocurrency exchange. We wanted to build something that could handle real-world financial demands with the speed, cost-effectiveness, and reliability that traditional finance requires.</p>

<p><strong>The XRP Ledger delivered on every front:</strong></p>

<h3>Lightning-Fast Settlement</h3>
<p>While Bitcoin transactions can take hours and Ethereum can be unpredictable, XRPL consistently settles transactions in 3-5 seconds. This isn't just impressive – it's essential for serious financial applications where timing matters.</p>

<h3>Minimal Transaction Costs</h3>
<p>With fees typically costing fractions of a cent, XRPL removes the cost barriers that make small investments unviable on other networks. Whether you're investing $10 or $10,000, the network fees won't eat into your returns.</p>

<h3>Environmental Responsibility</h3>
<p>Unlike energy-intensive proof-of-work systems, XRPL uses a consensus mechanism that consumes minimal electricity. This isn't just good for the planet – it's crucial for institutional adoption and regulatory compliance.</p>

<h2>Introducing xrpl.sale: Where Innovation Meets Accessibility</h2>

<p>Our platform isn't just another crypto interface – it's a comprehensive investment ecosystem designed for the modern digital economy.</p>

<h3>What Makes Us Different</h3>

<p><strong>Comprehensive KYC Integration</strong><br>
We've implemented institutional-grade Know Your Customer processes that protect both users and compliance requirements. Our streamlined verification system gets you investing quickly while maintaining the highest security standards.</p>

<p><strong>Presale Opportunities</strong><br>
Get early access to promising blockchain projects before they hit major exchanges. Our curated presale offerings give you first-mover advantage on carefully vetted opportunities.</p>

<h2>The Technology Behind the Platform</h2>

<p>Our technical foundation reflects our commitment to performance and reliability with Next.js 15, React 19, and TypeScript throughout for type-safe code that prevents errors.</p>

<h2>The Future of Digital Investment</h2>

<p>We're not just building a platform – we're pioneering the future of how people interact with digital assets. The combination of XRPL's technical advantages and our user-focused design creates possibilities that weren't feasible before.</p>`,
        meta_description: "Discover how XRPL's lightning-fast settlement and innovative features make xrpl.sale the future of digital investments.",
        featured_image_url: "/images/blog/xrpl-revolution.jpg",
        author: { id: 1, name: "XRPL.Sale Team", avatar: null },
        category: { id: 1, name: "XRPL Insights", slug: "xrpl-insights", color: "#6366f1" },
        tags: ["xrpl", "digital-investment", "platform", "innovation"],
        status: "published" as const,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        view_count: 2340,
        read_time_minutes: 12,
      };
    } else {
      mockArticle = {
        id: 1,
        title: "Understanding XRPL DEX Trading",
        slug: "understanding-xrpl-dex-trading",
        excerpt: "Learn how to trade efficiently on the XRP Ledger decentralized exchange.",
        content: "<p>The XRP Ledger DEX offers unique advantages for traders...</p><h2>Key Features</h2><p>Native decentralized exchange built into the ledger.</p>",
        meta_description: "Complete guide to XRPL DEX trading strategies and best practices.",
        featured_image_url: "/images/blog/xrpl-dex.jpg",
        author: { id: 1, name: "XRPL.Sale Team", avatar: null },
        category: { id: 1, name: "XRPL Insights", slug: "xrpl-insights", color: "#6366f1" },
        tags: ["xrpl", "dex", "trading"],
        status: "published" as const,
        published_at: new Date(Date.now() - 86400000).toISOString(),
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        view_count: 1250,
        read_time_minutes: 8,
      };
    }

    return {
      success: true,
      data: {
        article: mockArticle,
        related_articles: []
      }
    };
  }

  private getMockBlogCategories() {
    return [
      { id: 1, name: "XRPL Insights", slug: "xrpl-insights", description: "Deep insights into XRPL ecosystem", color: "#6366f1", article_count: 15 },
      { id: 2, name: "Platform Updates", slug: "platform-updates", description: "Latest platform news and updates", color: "#10b981", article_count: 8 },
      { id: 3, name: "DeFi Trends", slug: "defi-trends", description: "Latest DeFi trends and analysis", color: "#f59e0b", article_count: 12 }
    ];
  }

  private getMockBlogTags() {
    return {
      success: true,
      data: [
        { name: "xrpl", count: 25 },
        { name: "defi", count: 18 },
        { name: "trading", count: 12 },
        { name: "platform", count: 10 }
      ]
    };
  }

  private getMockBlogFeatured() {
    return {
      success: true,
      data: []
    };
  }

  private getMockBlogSitemap() {
    return {
      success: true,
      data: [
        {
          url: "/blog/revolutionizing-digital-investments-xrpl-xrplsale",
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: "weekly",
          priority: "0.9"
        },
        {
          url: "/blog/understanding-xrpl-dex-trading",
          lastmod: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          changefreq: "weekly",
          priority: "0.7"
        }
      ]
    };
  }

  // Changelog endpoints
  async getChangelog(params?: {
    page?: number;
    per_page?: number;
    version?: string;
    type?: string[];
    category?: string[];
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<any> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
      if (params?.version) searchParams.append('version', params.version);
      if (params?.type) searchParams.append('type', params.type.join(','));
      if (params?.category) searchParams.append('category', params.category.join(','));
      if (params?.dateFrom) searchParams.append('date_from', params.dateFrom);
      if (params?.dateTo) searchParams.append('date_to', params.dateTo);
      if (params?.search) searchParams.append('search', params.search);
      
      const queryString = searchParams.toString();
      
      // Use Flask backend only when explicitly enabled and available
      const useFlaskBackend = process.env.USE_FLASK_BACKEND === 'true' && this.baseURL.includes('127.0.0.1:5000');
      if (!useFlaskBackend) {
        const mockEndpoint = queryString ? `/api/mock/changelog?${queryString}` : '/api/mock/changelog';
        return this.requestNextJS<any>(mockEndpoint);
      }
      
      const endpoint = queryString ? `/api/v1/changelog?${queryString}` : '/api/v1/changelog';
      return this.request<any>(endpoint);
    } catch (error) {
      return this.getMockChangelog(params);
    }
  }

  async getChangelogEntry(version: string): Promise<any> {
    try {
      // Use Flask backend only when explicitly enabled and available
      const useFlaskBackend = process.env.USE_FLASK_BACKEND === 'true' && this.baseURL.includes('127.0.0.1:5000');
      if (!useFlaskBackend) {
        return this.requestNextJS<any>(`/api/mock/changelog/${version}`);
      }
      
      return this.request<any>(`/api/v1/changelog/${version}`);
    } catch (error) {
      return this.getMockChangelogEntry(version);
    }
  }

  // Mock data methods for changelog
  private getMockChangelog(params?: any) {
    const mockEntries = [
      {
        id: "entry-1",
        version: "2.1.0",
        date: "2024-12-20",
        title: "Major Platform Enhancement",
        description: "Enhanced user experience and new investment features",
        type: "major",
        category: "feature",
        author: "Development Team",
        pull_request: 156,
        commit_hash: "abc123def456",
        changes: [
          {
            id: "change-1",
            type: "added",
            title: "Advanced Portfolio Analytics",
            description: "Real-time portfolio tracking with detailed analytics and performance metrics",
            component: "Dashboard",
            breaking_change: false,
            related_issues: [45, 67]
          },
          {
            id: "change-2", 
            type: "changed",
            title: "Enhanced Investment Flow",
            description: "Streamlined investment process with better UX and faster confirmations",
            component: "Investment",
            breaking_change: false,
            related_issues: [23]
          },
          {
            id: "change-3",
            type: "fixed",
            title: "XRPL Connection Stability",
            description: "Improved connection reliability to XRPL network during high load",
            component: "Core",
            breaking_change: false,
            related_issues: [89, 91]
          }
        ]
      },
      {
        id: "entry-2",
        version: "2.0.5",
        date: "2024-12-15",
        title: "Security & Bug Fixes",
        description: "Important security updates and bug fixes",
        type: "patch",
        category: "security",
        author: "Security Team",
        pull_request: 142,
        commit_hash: "def789ghi012",
        changes: [
          {
            id: "change-4",
            type: "security",
            title: "Enhanced Authentication Security",
            description: "Strengthened wallet authentication with additional security measures",
            component: "Auth",
            breaking_change: false,
            related_issues: [78]
          },
          {
            id: "change-5",
            type: "fixed",
            title: "Mobile Responsive Issues",
            description: "Fixed various mobile display issues across different screen sizes",
            component: "UI",
            breaking_change: false,
            related_issues: [34, 56]
          }
        ]
      },
      {
        id: "entry-3",
        version: "2.0.0",
        date: "2024-12-01",
        title: "Next.js 15 Migration",
        description: "Major architecture upgrade to Next.js 15 with improved performance",
        type: "major",
        category: "breaking",
        author: "Architecture Team",
        pull_request: 125,
        commit_hash: "ghi345jkl678",
        changes: [
          {
            id: "change-6",
            type: "changed",
            title: "React 19 Upgrade",
            description: "Upgraded to React 19 for improved performance and new features",
            component: "Core",
            breaking_change: true,
            migration_notes: "Update React components to use new concurrent features",
            related_issues: [12, 15, 18]
          },
          {
            id: "change-7",
            type: "added",
            title: "Turbopack Support",
            description: "Added Turbopack for faster development and build times",
            component: "Build",
            breaking_change: false,
            related_issues: [20]
          },
          {
            id: "change-8",
            type: "removed",
            title: "Legacy API Endpoints",
            description: "Removed deprecated API endpoints from v1",
            component: "API",
            breaking_change: true,
            migration_notes: "Use new v2 API endpoints - see migration guide",
            related_issues: [25, 30]
          }
        ]
      }
    ];

    // Apply filtering if provided
    let filteredEntries = [...mockEntries];
    
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredEntries = filteredEntries.filter(entry =>
        entry.title.toLowerCase().includes(searchTerm) ||
        entry.description.toLowerCase().includes(searchTerm) ||
        entry.changes.some(change => 
          change.title.toLowerCase().includes(searchTerm) ||
          change.description.toLowerCase().includes(searchTerm)
        )
      );
    }

    if (params?.type) {
      filteredEntries = filteredEntries.filter(entry =>
        params.type.includes(entry.type)
      );
    }

    if (params?.category) {
      filteredEntries = filteredEntries.filter(entry =>
        params.category.includes(entry.category)
      );
    }

    if (params?.version) {
      filteredEntries = filteredEntries.filter(entry =>
        entry.version === params.version
      );
    }

    return {
      success: true,
      data: {
        entries: filteredEntries,
        total: filteredEntries.length,
        page: params?.page || 1,
        per_page: params?.per_page || 10,
        has_next: false,
        has_prev: false,
        versions: ["2.1.0", "2.0.5", "2.0.0", "1.9.2", "1.9.1"]
      }
    };
  }

  private getMockChangelogEntry(version: string) {
    const mockEntries = this.getMockChangelog().data.entries;
    const entry = mockEntries.find(e => e.version === version);
    
    if (!entry) {
      throw new Error(`Changelog entry for version ${version} not found`);
    }

    return {
      success: true,
      data: { entry }
    };
  }
}

// Export singleton instance
export const api = new APIClient();

// Simple cache for frequently accessed data (5 minute TTL)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T, ttlMs: number = 300000): void {
  cache.set(key, { data, timestamp: Date.now(), ttl: ttlMs });
}

// Convenience functions
export async function getXRPLStats(): Promise<XRPLStats | null> {
  const cached = getCached<XRPLStats>('xrpl-stats');
  if (cached) return cached;

  try {
    const data = await api.getXRPLStats();
    setCache('xrpl-stats', data, 60000); // 1 minute cache for stats
    return data;
  } catch (error) {
    logger.error('Failed to fetch XRPL stats', {}, error as Error);
    return null;
  }
}

export async function getPresaleStatus(): Promise<PresaleStatus | null> {
  const cached = getCached<PresaleStatus>('presale-status');
  if (cached) return cached;

  try {
    const data = await api.getPresaleStatus();
    setCache('presale-status', data, 30000); // 30 second cache for presale status
    return data;
  } catch (error) {
    logger.error('Failed to fetch presale status', {}, error as Error);
    return null;
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    return await api.getProjects();
  } catch (error) {
    logger.error('Failed to fetch projects', {}, error as Error);
    return [];
  }
}

export async function getProject(id: string | number): Promise<Project | null> {
  try {
    return await api.getProject(id);
  } catch (error) {
    logger.error(`Failed to fetch project ${id}`, {}, error as Error);
    return null;
  }
}

export async function getPresaleAnalytics(): Promise<PresaleAnalytics | null> {
  const cached = getCached<PresaleAnalytics>('presale-analytics');
  if (cached) return cached;

  try {
    const data = await api.getPresaleAnalytics();
    setCache('presale-analytics', data, 120000); // 2 minute cache for analytics
    return data;
  } catch (error) {
    logger.error('Failed to fetch presale analytics', {}, error as Error);
    return null;
  }
}

export async function getAccountInfo(accountAddress: string): Promise<AccountInfo | null> {
  try {
    return await api.getAccountInfo(accountAddress);
  } catch (error) {
    logger.error(`Failed to fetch account info for ${accountAddress}`, {}, error as Error);
    return null;
  }
}

export async function authenticateWallet(walletAddress: string, signature: string, message: string, publicKey?: string): Promise<AuthResponse | null> {
  try {
    return await api.authenticateWallet(walletAddress, signature, message, publicKey);
  } catch (error) {
    logger.error('Failed to authenticate wallet', {}, error as Error);
    return null;
  }
}

// Landing content with mock fallback and caching
const defaultLandingMock: LandingContent = {
  hero: {
    title: 'Create, Launch & Grow on XRPL',
    subtitle:
      'Ship tokens, build profiles, and run campaigns—no smart contracts needed.',
    primaryCta: { label: 'Join XSALE Presale', href: '/projects/0' },
    secondaryCta: { label: 'Browse Projects', href: '/projects' },
  },
  features: [
    { icon: '⚡', title: 'Native XRPL', description: 'Fast, cheap, and secure.' },
    { icon: '🎯', title: 'Progressive Tiers', description: 'Fair pricing benefits early supporters.' },
    { icon: '🛡️', title: 'Secure Escrow', description: 'XRPL native escrow for safety.' },
  ],
  stats: { total_projects: 0, total_users: 0, total_raised_xrp: 0 },
  updated_at: new Date().toISOString(),
};

export async function getLandingContent(options?: { cacheTtlMs?: number }): Promise<LandingContent> {
  const key = 'landing-content';
  const cached = getCached<LandingContent>(key);
  if (cached) return cached;
  try {
    const data = await api.getLandingContent();
    setCache(key, data, options?.cacheTtlMs ?? 120000);
    return data;
  } catch (error) {
    logger.error('Failed to fetch landing content, using mock', {}, error as Error);
    setCache(key, defaultLandingMock, options?.cacheTtlMs ?? 60000);
    return defaultLandingMock;
  }
}

// Batch API calls for dashboard loading
export async function getDashboardData(): Promise<{
  xrplStats: XRPLStats | null;
  presaleStatus: PresaleStatus | null;
}> {
  logger.info('Loading dashboard data in parallel');
  
  const [xrplStats, presaleStatus] = await Promise.allSettled([
    getXRPLStats(),
    getPresaleStatus()
  ]);

  return {
    xrplStats: xrplStats.status === 'fulfilled' ? xrplStats.value : null,
    presaleStatus: presaleStatus.status === 'fulfilled' ? presaleStatus.value : null,
  };
}

export async function getProjectsData(): Promise<{
  projects: Project[];
  presaleStatus: PresaleStatus | null;
  presaleAnalytics: PresaleAnalytics | null;
}> {
  logger.info('Loading projects data in parallel');

  const [projects, presaleStatus, presaleAnalytics] = await Promise.allSettled([
    getProjects(),
    getPresaleStatus(),
    getPresaleAnalytics()
  ]);

  return {
    projects: projects.status === 'fulfilled' ? projects.value : [],
    presaleStatus: presaleStatus.status === 'fulfilled' ? presaleStatus.value : null,
    presaleAnalytics: presaleAnalytics.status === 'fulfilled' ? presaleAnalytics.value : null,
  };
}

// Blog API convenience functions
export async function getBlogArticles(params?: {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}): Promise<BlogListResponse | null> {
  const cached = getCached<BlogListResponse>(`blog-articles-${JSON.stringify(params)}`);
  if (cached) return cached;

  try {
    const data = await api.getBlogArticles(params);
    setCache(`blog-articles-${JSON.stringify(params)}`, data, 300000); // 5 minute cache
    return data;
  } catch (error) {
    logger.error('Failed to fetch blog articles', { params }, error as Error);
    return null;
  }
}

export async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  const cached = getCached<BlogArticle>(`blog-article-${slug}`);
  if (cached) return cached;

  try {
    const data = await api.getBlogArticle(slug);
    setCache(`blog-article-${slug}`, data, 300000); // 5 minute cache
    return data;
  } catch (error) {
    logger.error(`Failed to fetch blog article ${slug}`, {}, error as Error);
    return null;
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const cached = getCached<BlogCategory[]>('blog-categories');
  if (cached) return cached;

  try {
    const data = await api.getBlogCategories();
    setCache('blog-categories', data, 600000); // 10 minute cache for categories
    return data;
  } catch (error) {
    logger.error('Failed to fetch blog categories', {}, error as Error);
    return [];
  }
}

// Changelog API convenience functions
export async function getChangelog(params?: {
  page?: number;
  per_page?: number;
  version?: string;
  type?: string[];
  category?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}) {
  const cached = getCached(`changelog-${JSON.stringify(params)}`);
  if (cached) return cached;

  try {
    const data = await api.getChangelog(params);
    setCache(`changelog-${JSON.stringify(params)}`, data, 300000); // 5 minute cache
    return data;
  } catch (error) {
    logger.error('Failed to fetch changelog', { params }, error as Error);
    return null;
  }
}

export async function getChangelogEntry(version: string) {
  const cached = getCached(`changelog-entry-${version}`);
  if (cached) return cached;

  try {
    const data = await api.getChangelogEntry(version);
    setCache(`changelog-entry-${version}`, data, 300000); // 5 minute cache
    return data;
  } catch (error) {
    logger.error(`Failed to fetch changelog entry ${version}`, {}, error as Error);
    return null;
  }
}