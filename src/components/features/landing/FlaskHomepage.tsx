import { Suspense } from 'react';
import Link from 'next/link';
import { getLandingContent, getPresaleStatus } from '@/lib/api-simple';
import { FlaskHomepageClient } from './FlaskHomepageClient';

export const revalidate = 60;

export async function FlaskHomepage() {
  // Fetch Flask content and presale data
  const [content, presaleStatus] = await Promise.all([
    getLandingContent().catch(() => null),
    getPresaleStatus().catch(() => null)
  ]);

  // If Flask content is not available, show error message
  if (!content) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-xl text-slate-400">Unable to load content from Flask backend</p>
          <Link href="/projects" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
            View Projects instead
          </Link>
        </div>
      </div>
    );
  }

  return <FlaskHomepageClient content={content} presaleStatus={presaleStatus} />;
}