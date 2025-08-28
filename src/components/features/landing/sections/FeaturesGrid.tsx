import type { LandingFeatureItem } from '@/lib/api-simple';

export function FeaturesGrid({ items }: { items: LandingFeatureItem[] }) {
  return (
    <section className="py-8 bg-slate-800/30 rounded-xl border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {items.map((f, i) => (
          <div key={i} className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-purple-400/50 transition-all hover:transform hover:scale-105">
            {f.icon && <div className="text-3xl mb-4" aria-hidden>{f.icon}</div>}
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-300">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
