import { NextResponse } from 'next/server';
import type { BlogListResponse, BlogArticle, BlogCategory } from '@/types/blog';

// Extended mock blog articles that match the api-simple.ts mock data
const mockArticles: BlogArticle[] = [
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
  },
  {
    id: 4,
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
  }
];

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
  
  const articles = featured ? mockArticles.filter(a => a.is_featured) : mockArticles;
  
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