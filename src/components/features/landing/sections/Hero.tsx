import Link from 'next/link';
import type { LandingHero as LandingHeroType } from '@/lib/api-simple';

export function LandingHero({ hero }: { hero: LandingHeroType }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-xl border border-slate-700">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {hero.title}
        </h1>
        {hero.subtitle && (
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto">{hero.subtitle}</p>
        )}
        {(hero.primaryCta || hero.secondaryCta) && (
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            {hero.primaryCta && (
              <Link
                href={hero.primaryCta.href}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
              >
                {hero.primaryCta.label}
              </Link>
            )}
            {hero.secondaryCta && (
              <Link
                href={hero.secondaryCta.href}
                className="px-8 py-3 border border-cyan-400 text-cyan-400 rounded-lg font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all"
              >
                {hero.secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
