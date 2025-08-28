// Blog system TypeScript definitions for XRPL.Sale
// Integrates with Flask backend API and Next.js frontend

export interface BlogArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  author_image?: string;
  featured_image?: string;
  published_at: string;
  updated_at: string;
  is_published: boolean;
  is_featured: boolean;
  category: BlogCategory;
  tags: string[];
  view_count: number;
  read_time_minutes: number;
  meta_title?: string;
  meta_description?: string;
  social_image?: string;
}

export interface BlogCategory {
  id: number;
  slug: string;
  name: string;
  description?: string;
  color?: string;
  article_count: number;
}

export interface BlogListResponse {
  articles: BlogArticle[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface BlogSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  page?: number;
  per_page?: number;
  featured?: boolean;
}

export interface BlogStats {
  total_articles: number;
  total_categories: number;
  most_popular_tags: string[];
  recent_articles_count: number;
}

export interface RelatedArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featured_image?: string;
  published_at: string;
  category: Pick<BlogCategory, 'name' | 'slug' | 'color'>;
  read_time_minutes: number;
}