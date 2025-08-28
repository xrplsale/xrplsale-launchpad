import { getLandingContent } from '@/lib/api-simple';
import { LandingHero, FeaturesGrid } from '@/components/features/landing';

export const revalidate = 120; // cache page for 2 minutes

export default async function LandingPage() {
  const content = await getLandingContent().catch(() => null);

  return (
    <div className="min-h-screen bg-slate-900 text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content?.hero && <LandingHero hero={content.hero} />}
        {content?.features?.length ? (
          <div className="mt-12">
            <FeaturesGrid items={content.features} />
          </div>
        ) : null}
        {content?.updated_at && (
          <p className="mt-8 text-xs text-slate-500">Updated: {new Date(content.updated_at).toLocaleString()}</p>
        )}
      </div>
    </div>
  );
}
