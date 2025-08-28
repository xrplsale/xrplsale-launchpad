import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getBlogArticle, getBlogArticles } from '@/lib/api-simple';
import { BlogArticle } from '@/components/features/blog/BlogArticle';
import { BlogRelated } from '@/components/features/blog/BlogRelated';
import { BlogLoadingState } from '@/components/features/blog/BlogLoadingState';
import type { BlogArticle as BlogArticleType } from '@/types/blog';

interface BlogArticlePageProps {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  try {
  const { slug } = params;
    const article = await getBlogArticle(slug);
    
    if (!article) {
      return {
        title: 'Article Not Found - XRPL.Sale Blog'
      };
    }

    return {
      title: article.meta_title || `${article.title} - XRPL.Sale Blog`,
      description: article.meta_description || article.excerpt,
      openGraph: {
        title: article.title,
        description: article.excerpt,
        type: 'article',
        url: `/blog/${slug}`,
        images: (article.social_image || article.featured_image) ? [
          {
            url: article.social_image || article.featured_image!,
            width: 1200,
            height: 630,
            alt: article.title
          }
        ] : undefined,
        publishedTime: article.published_at,
        modifiedTime: article.updated_at,
        authors: [article.author]
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.excerpt,
        images: article.social_image || article.featured_image
      },
      alternates: {
        canonical: `/blog/${slug}`
      }
    };
  } catch (error) {
    return {
      title: 'Article Not Found - XRPL.Sale Blog'
    };
  }
}

export const revalidate = 300; // 5 minutes

// Force dynamic rendering to avoid serving a cached 404 while debugging prod
export const dynamic = 'force-dynamic';

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = params;
  const article = await getBlogArticle(slug).catch(() => null);
  
  if (!article) {
    notFound();
  }

  // Fetch related articles (same category or tags)
  const relatedArticles = await getBlogArticles({
    category: article.category?.slug,
    per_page: 3,
    // Exclude current article by filtering on frontend
  }).then(data => {
    if (data?.articles) {
      return data.articles.filter((a: BlogArticleType) => a.slug !== slug).slice(0, 3);
    }
    return [];
  }).catch(() => []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Breadcrumb Navigation */}
      <nav className="border-b border-slate-700 bg-slate-800/50">
        <div className="container-main py-4">
          <div className="flex items-center text-sm text-slate-400 space-x-2">
            <a href="/" className="hover:text-cyan-400 transition-colors">Home</a>
            <span>/</span>
            <a href="/blog" className="hover:text-cyan-400 transition-colors">Blog</a>
            {article.category && (
              <>
                <span>/</span>
                <a 
                  href={`/blog/category/${article.category.slug}`}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {article.category.name}
                </a>
              </>
            )}
            <span>/</span>
            <span className="text-slate-300">{article.title}</span>
          </div>
        </div>
      </nav>

      <main className="container-main py-8 lg:py-16">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="max-w-4xl blog-content-container">
              {/* Article Content */}
              <Suspense fallback={<BlogLoadingState />}>
                <BlogArticle article={article} />
              </Suspense>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section className="mt-12 lg:mt-16 pt-8 lg:pt-16 border-t border-slate-700">
                  <Suspense fallback={
                    <div className="space-y-6">
                      <div className="h-8 bg-slate-700 rounded w-48 animate-pulse"></div>
                      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1,2,3].map(i => (
                          <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                            <div className="aspect-video bg-slate-700 rounded-lg mb-4"></div>
                            <div className="h-6 bg-slate-700 rounded mb-3"></div>
                            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  }>
                    <BlogRelated 
                      articles={relatedArticles} 
                      currentArticleSlug={slug}
                    />
                  </Suspense>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 order-first lg:order-last">
            <div className="sticky top-8 space-y-6 lg:space-y-8">
              <Suspense fallback={
                <div className="space-y-8">
                  <div className="glass-card rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-slate-700 rounded w-32 mb-4"></div>
                    <div className="space-y-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-4 bg-slate-700 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              }>
                <div className="space-y-8">
                  {/* Table of Contents - Auto-generated from headings */}
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      In this article
                    </h3>
                    <nav className="text-sm">
                      <div className="text-slate-400">
                        <p className="mb-2">• Architecture Overview</p>
                        <p className="mb-2">• Implementation Details</p>
                        <p className="mb-2">• Performance Benefits</p>
                        <p className="mb-2">• Best Practices</p>
                      </div>
                    </nav>
                  </div>

                  {/* Article Meta Info */}
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Article Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Published</span>
                        <span className="text-slate-300">
                          {new Date(article.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Reading time</span>
                        <span className="text-slate-300">{article.read_time_minutes} min</span>
                      </div>
                      {article.view_count > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Views</span>
                          <span className="text-slate-300">{article.view_count.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="pt-3 border-t border-slate-700">
                        <span className="text-slate-400 text-xs">Category</span>
                        <div className="mt-1">
                          <span 
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
                            style={{
                              backgroundColor: `${article.category.color || 'var(--brand-primary)'}20`,
                              borderColor: `${article.category.color || 'var(--brand-primary)'}40`,
                              color: article.category.color || 'var(--brand-accent)'
                            }}
                          >
                            {article.category.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Suspense>
            </div>
          </aside>
        </div>
      </main>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article.title,
            "description": article.excerpt,
            "image": article.featured_image || article.social_image,
            "author": {
              "@type": "Person",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "XRPL.Sale",
              "logo": {
                "@type": "ImageObject",
                "url": "/images/logo.png"
              }
            },
            "datePublished": article.published_at,
            "dateModified": article.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `/blog/${slug}`
            }
          })
        }}
      />
    </div>
  );
}