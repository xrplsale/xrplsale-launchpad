import { NextResponse } from 'next/server';
import type { BlogListResponse, BlogArticle, BlogCategory } from '@/types/blog';

// Mock blog article data based on blogposttest.md
const mockArticle: BlogArticle = {
  id: 1,
  title: "Why We Chose a Decoupled Architecture: Separating Frontend and Backend for Scale, Performance, and Reliability",
  slug: "decoupled-architecture-frontend-backend-scale",
  content: `
<p>How modern web architecture decisions transformed our XRPL tokenization platform — and practical insights for your Next.js 15 + Flask deployment on Vercel</p>

<p>When we set out to build <a href="https://xrpl-sale-frontend.vercel.app/">XRPL.Sale</a>, a platform for XRPL token presales and investments, we faced a crucial architectural decision: should we build a monolithic application or separate our frontend and backend? After careful consideration of performance, scalability, and maintainability requirements, we chose a decoupled architecture — and the results have been transformative.</p>

<h2>The Challenge: Building for Growth and Reliability</h2>

<p>Modern web applications face competing demands: they need to be fast, scalable, maintainable, and secure. For XRPL.Sale, we needed a platform that could:</p>

<ul>
<li>Handle high-traffic token launches with minimal latency</li>
<li>Process complex financial transactions securely</li>
<li>Scale independently for reads (browsing tokens) and writes (transactions)</li>
<li>Support rapid development cycles without deployment bottlenecks</li>
<li>Maintain 99.9% uptime for critical financial operations</li>
</ul>

<h2>Why We Chose Frontend-Backend Separation</h2>

<h3>1. Architectural Optimization</h3>

<p>Our frontend and backend serve fundamentally different purposes:</p>

<ul>
<li><strong>Frontend (Next.js 15 + React 19)</strong>: Delivers blazing-fast user experiences through React Server Components, Server-Side Rendering (SSR), and Incremental Static Regeneration (ISR)</li>
<li><strong>Backend (Flask)</strong>: Handles complex business logic, database operations, and secure API endpoints</li>
</ul>

<p>By separating these concerns, each layer can be optimized for its specific role without compromising the other.</p>

<h2>Real-World Performance Benefits</h2>

<p>Since implementing this architecture, we've seen:</p>

<ul>
<li><strong>50% faster page loads</strong> through optimized caching strategies</li>
<li><strong>99.9% uptime</strong> with independent service health</li>
<li><strong>75% reduction in deployment risks</strong> through isolation</li>
<li><strong>3x faster development cycles</strong> with parallel team workflows</li>
</ul>
  `,
  excerpt: "How modern web architecture decisions transformed our XRPL tokenization platform — and practical insights for your Next.js 15 + Flask deployment on Vercel",
  featured_image: "/images/blog/architecture-cover.jpg",
  meta_description: "Learn why we separated our Next.js 15 frontend and Flask backend for better performance, scalability, and reliability on Vercel. Practical insights and code examples included.",
  author: "XRPL.Sale Team",
  published_at: "2025-08-27T12:00:00Z",
  updated_at: "2025-08-27T12:00:00Z",
  category: {
    id: 1,
    name: "Technical Architecture",
    slug: "technical-architecture",
    description: "Deep dives into technical decisions and architecture patterns",
    article_count: 5
  },
  tags: ["Next.js", "Flask", "Architecture", "Performance", "Vercel", "XRPL"],
  view_count: 156,
  read_time_minutes: 12,
  is_featured: true,
  is_published: true
};

const mockCategories: BlogCategory[] = [
  {
    id: 1,
    name: "Technical Architecture",
    slug: "technical-architecture",
    description: "Deep dives into technical decisions and architecture patterns",
    article_count: 1
  },
  {
    id: 2,
    name: "XRPL Insights",
    slug: "xrpl-insights", 
    description: "Analysis and updates from the XRPL ecosystem",
    article_count: 0
  },
  {
    id: 3,
    name: "Platform Updates",
    slug: "platform-updates",
    description: "Latest features and improvements to XRPL.Sale",
    article_count: 0
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const per_page = parseInt(searchParams.get('per_page') || '12');
  const featured = searchParams.get('featured') === 'true';
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const articles = featured ? [mockArticle] : [mockArticle];
  
  const response: BlogListResponse = {
    articles,
    total_count: articles.length,
    total_pages: 1,
    page: page,
    per_page,
    has_next: false,
    has_prev: false
  };
  
  return NextResponse.json({
    success: true,
    data: response
  });
}