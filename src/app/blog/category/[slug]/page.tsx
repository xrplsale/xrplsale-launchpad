import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getBlogArticles, getBlogCategories } from '@/lib/api-simple';
import { BlogList } from '@/components/features/blog/BlogList';
import { BlogSidebar } from '@/components/features/blog/BlogSidebar';
import { BlogLoadingState } from '@/components/features/blog/BlogLoadingState';

interface CategoryPageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getBlogCategories().catch(() => []);
  const category = categories.find(cat => cat.slug === params.slug);
  
  if (!category) {
    return { title: 'Category Not Found - XRPL.Sale Blog' };
  }

  return {
    title: `${category.name} Articles - XRPL.Sale Blog`,
    description: category.description || `Read the latest articles about ${category.name} on XRPL.Sale.`,
    openGraph: {
      title: `${category.name} Articles`,
      description: category.description || `Articles about ${category.name}`,
      type: 'website',
      url: `/blog/category/${params.slug}`
    }
  };
}

export const revalidate = 300; // 5 minutes

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = parseInt(searchParams.page || '1');
  
  // Fetch articles and categories
  const [articlesData, categories] = await Promise.all([
    getBlogArticles({
      page: currentPage,
      per_page: 12,
      category: params.slug
    }).catch(() => null),
    getBlogCategories().catch(() => [])
  ]);

  // Find the current category
  const currentCategory = categories.find(cat => cat.slug === params.slug);
  
  if (!currentCategory) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Category Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 border-b border-slate-700">
        <div className="container-main py-16">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-slate-400 mb-6">
              <a href="/" className="hover:text-cyan-400 transition-colors">Home</a>
              <span className="mx-2">/</span>
              <a href="/blog" className="hover:text-cyan-400 transition-colors">Blog</a>
              <span className="mx-2">/</span>
              <span className="text-slate-300">{currentCategory.name}</span>
            </nav>
            
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${currentCategory.color || 'var(--brand-primary)'}20` }}
              >
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: currentCategory.color || 'var(--brand-primary)' }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {currentCategory.name}
                </h1>
                <p className="text-slate-400">
                  {currentCategory.article_count} article{currentCategory.article_count !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            {currentCategory.description && (
              <p className="text-lg text-slate-300 leading-relaxed">
                {currentCategory.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="container-main py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Suspense fallback={<BlogLoadingState />}>
              <BlogList 
                articlesData={articlesData}
                currentPage={currentPage}
                category={params.slug}
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