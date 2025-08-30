import { NextResponse } from 'next/server';
import type { BlogArticle } from '@/types/blog';

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
    content: `<h1>Understanding XRPL DEX Trading</h1>
    
<p>The XRP Ledger DEX offers unique advantages for traders looking to exchange digital assets in a truly decentralized manner. Built directly into the ledger protocol, it provides a level of integration and efficiency that standalone DEX applications simply can't match.</p>

<h2>Key Features of XRPL DEX</h2>

<h3>Native Integration</h3>
<p>Unlike other DEXs that run on smart contracts, XRPL's DEX functionality is built directly into the ledger core. This means every transaction benefits from the same speed and cost-effectiveness of the underlying XRPL network.</p>

<h3>Order Book Model</h3>
<p>XRPL uses a traditional order book model rather than automated market makers (AMMs), providing familiar trading mechanics for users coming from centralized exchanges.</p>

<h2>Trading Strategies</h2>

<p>Whether you're arbitraging between different exchanges or providing liquidity to earn fees, understanding these mechanics is crucial for success on XRPL DEX.</p>`,
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
    content: `<h1>XRPL.Sale Platform Updates - Q1 2024</h1>
    
<p>We're thrilled to announce several major updates and new features that are rolling out to the XRPL.Sale platform this quarter. These improvements focus on user experience, security, and expanding our investment opportunities.</p>

<h2>New Features</h2>

<h3>Enhanced Portfolio Dashboard</h3>
<p>Our new portfolio interface provides real-time tracking of your investments with detailed analytics and performance metrics.</p>

<h3>Mobile Application</h3>
<p>Access your investments on the go with our new mobile app, featuring all the functionality of the desktop platform optimized for mobile devices.</p>

<h2>Security Improvements</h2>
<p>We've implemented additional security measures including multi-factor authentication and enhanced wallet integration security.</p>`,
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Find article by slug
  const article = mockArticles.find(a => a.slug === slug);
  
  if (!article) {
    return NextResponse.json({
      success: false,
      error: 'Article not found'
    }, { status: 404 });
  }
  
  return NextResponse.json({
    success: true,
    data: {
      article,
      related_articles: []
    }
  });
}