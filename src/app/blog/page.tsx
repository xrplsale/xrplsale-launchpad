import { Metadata } from 'next';
import { Suspense } from 'react';
import { getBlogArticles, getBlogCategories } from '@/lib/api-simple';
import { BlogHero } from '@/components/features/blog/BlogHero';
import { BlogList } from '@/components/features/blog/BlogList';
import { BlogSidebar } from '@/components/features/blog/BlogSidebar';
import { BlogLoadingState } from '@/components/features/blog/BlogLoadingState';
import { BlogStatusBanner } from '@/components/features/blog/BlogStatusBanner';

export const metadata: Metadata = {
  title: 'XRPL.Sale Blog - XRPL Insights, Platform Updates & DeFi Trends',
  description: 'Stay updated with the latest XRPL ecosystem insights, platform updates, and DeFi trends from the XRPL.Sale team.',
  openGraph: {
    title: 'XRPL.Sale Blog',
    description: 'XRPL ecosystem insights and platform updates',
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/images/blog/blog-og-image.png',
        width: 1200,
        height: 630,
        alt: 'XRPL.Sale Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XRPL.Sale Blog',
    description: 'XRPL ecosystem insights and platform updates'
  }
};

export const revalidate = 300; // 5 minutes

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
    featured?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || '1');
  const category = resolvedSearchParams.category;
  const search = resolvedSearchParams.search;
  const featuredOnly = resolvedSearchParams.featured === 'true';

  // Fetch blog data and categories with error detection
  let isUsingMockData = false;
  let apiError: string | null = null;

  // Check if we're configured to use Flask backend
  const useFlaskBackend = process.env.USE_FLASK_BACKEND === 'true';
  
  // If not using Flask backend, we're using mock data (this is normal in production)
  if (!useFlaskBackend) {
    isUsingMockData = true;
  }

  const [articlesData, categories] = await Promise.all([
    getBlogArticles({
      page,
      per_page: 12,
      category,
      search,
      featured: featuredOnly
    }).catch((error) => {
      apiError = error?.message || 'Failed to connect to API';
      return null;
    }),
    getBlogCategories().catch((error) => {
      if (!apiError) {
        apiError = error?.message || 'Failed to connect to API';
      }
      return [];
    })
  ]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Blog Hero Section */}
      <BlogHero 
        categories={categories} 
        initialSearch={search}
      />
      
      <main className="container-main py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <BlogStatusBanner 
              isUsingMockData={isUsingMockData}
              hasApiError={!!apiError}
            />
            <Suspense fallback={<BlogLoadingState />}>
              <BlogList 
                articlesData={articlesData}
                currentPage={page}
                category={category}
                search={search}
                featuredOnly={featuredOnly}
                isError={isUsingMockData && !articlesData}
                errorMessage={apiError || undefined}
              />
            </Suspense>
          </div>
          
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="space-y-6">
              <div className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            </div>}>
              <BlogSidebar categories={categories} />
            </Suspense>
          </aside>
        </div>
      </main>
    </div>
  );
}