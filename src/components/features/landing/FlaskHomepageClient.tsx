'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import PresaleInfo from '@/components/PresaleInfo';
import { ScrollReveal, StaggeredReveal, ParallaxScroll, CounterAnimation } from '@/components/shared/ScrollReveal';
// import { StarField, CosmicDust } from '@/components/shared/ParticleSystem';
// import { CursorEffects, div } from '@/components/shared/CursorEffects';
import { EnhancedButton } from '@/components/ui/Button/Button';
import type { LandingContent, PresaleStatus } from '@/lib/api-simple';

// Popular search button component
function SearchButton({ term }: { term: string }) {
  return (
    <div>
      <button 
        className="btn-ghost text-sm whitespace-nowrap"
        onClick={() => console.log(`Search for: ${term}`)}
      >
        {term}
      </button>
    </div>
  );
}

// Enhanced Presale card component with better UX
function PresaleCard({ presale }: { presale: LandingContent['presale'] }) {
  if (!presale) {
    return <div className="glass-card rounded-2xl p-6 border-brand-primary/20">Loading presale data...</div>;
  }
  
  const progress = presale.tier_progress || 0;
  const daysLeft = Math.floor((presale.sale_end_timestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="glass-card rounded-2xl p-6 border-brand-primary/20 relative overflow-hidden group">
      {/* Unified brand gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/30 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
            <span className="text-brand-accent text-sm font-medium">ACTIVE PRESALE</span>
          </div>
          <div className="text-slate-400 text-xs bg-slate-800/50 px-2 py-1 rounded-full">
            Platform Token
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-bold text-white">XSALE Token</h3>
            <div className="px-2 py-1 bg-gradient-to-r from-brand-primary/20 to-brand-accent/20 border border-brand-primary/30 rounded-full">
              <span className="text-xs font-medium text-brand-accent">Utility</span>
            </div>
          </div>
          <p className="text-slate-300 text-body-enhanced mb-4 leading-relaxed">
            Platform utility token for XRPL.Sale. Earn revenue share, get allocation multipliers, and unlock premium features.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
              <span>100M Supply</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
              <span>10 Tiers</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-brand-primary/10">
            <div className="text-sm text-brand-accent mb-2 font-medium">Current Tier</div>
            <div className="text-2xl font-bold text-white mb-1">Tier {presale.current_tier}</div>
            <div className="text-sm text-slate-400 font-medium">{presale.current_price} XRP</div>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-brand-primary/10">
            <div className="text-sm text-brand-accent mb-2 font-medium">Total Raised</div>
            <div className="text-2xl font-bold text-white mb-1">{presale.total_raised} XRP</div>
            <div className="text-sm text-slate-400 font-medium">of {presale.tier_goal} XRP</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-300">Tier Progress</span>
            <span className="text-sm font-bold text-brand-accent">{progress.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-bg h-3 relative overflow-hidden">
            <div 
              className="progress-bar-fill h-3 transition-all duration-700 ease-out" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="text-center mb-8 p-4 bg-gradient-to-r from-brand-accent/10 to-brand-primary/10 border border-brand-primary/20 rounded-xl">
          <div className="text-sm text-brand-accent mb-2 font-medium">Sale Ends In</div>
          <div className="text-2xl font-bold text-white">{daysLeft > 0 ? `${daysLeft} Days` : 'Soon'}</div>
          <div className="text-xs text-brand-accent/70 mt-1">Limited Time Offer</div>
        </div>

        <EnhancedButton
          variant="primary"
          size="lg"
          fullWidth
          magnetic
          depth3D
          glow
          className="group/btn text-center"
          onClick={() => window.location.href = '/projects/0'}
          aria-label="Purchase XSALE tokens in the presale"
        >
          <span className="flex items-center justify-center gap-2">
            Buy XSALE Now
            <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </EnhancedButton>
      </div>
    </div>
  );
}

// Enhanced Stats section with better visual impact
function StatsSection({ stats }: { stats: { total_projects?: number; active_presales?: number; total_raised?: number; success_rate?: number } }) {
  const statsData = [
    {
      value: stats.total_projects,
      label: "Total Projects",
      icon: "📊",
      color: "text-purple-400",
      bg: "bg-purple-500/10"
    },
    {
      value: stats.active_presales,
      label: "Active Projects",
      icon: "🚀",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10"
    },
    {
      value: stats.total_raised,
      label: "Total Raised",
      icon: "👥",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10"
    },
    {
      value: `${((stats.success_rate || 0) * 100).toFixed(1)}%`,
      label: "Success Rate",
      icon: "💎",
      color: "text-pink-400",
      bg: "bg-pink-500/10"
    }
  ];

  return (
    <section className="section-y-sm">
      <StaggeredReveal
        staggerDelay={150}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsData.map((stat, index) => (
          <div key={index}>
            <div className="glass-card rounded-xl p-6 text-center group border-slate-700/30 card-tilt">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg} mb-4 group-hover:scale-110 transition-transform float-gentle`}>
                <span className="text-2xl" role="img" aria-hidden="true">
                  {stat.icon}
                </span>
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-2 tabular-nums`}>
                {typeof stat.value === 'number' ? (
                  <CounterAnimation to={stat.value} duration={2000} delay={index * 200} />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm font-medium text-slate-300">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </StaggeredReveal>
    </section>
  );
}

// FAQ section
function FAQSection({ faq }: { faq: Array<{ q: string; a: string }> }) {
  return (
    <div className="py-16 bg-slate-800/30">
      <div className="container-main">
        <h2 className="text-3xl font-bold text-center mb-12 text-gradient-brand">
          Frequently Asked Questions
        </h2>
        <StaggeredReveal
          staggerDelay={150}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {faq.map((item, index) => (
            <div key={index}>
              <div className="glass-card rounded-lg p-6 border-slate-700/50 card-tilt">
                <h3 className="text-lg font-semibold text-white mb-3">{item.q}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </StaggeredReveal>
      </div>
    </div>
  );
}

export function FlaskHomepageClient({ 
  content, 
  presaleStatus 
}: { 
  content: LandingContent; 
  presaleStatus: PresaleStatus | null; 
}) {
  // Fix hydration mismatch by formatting date on client side only
  const [formattedDate, setFormattedDate] = useState<string>('');
  
  // Intersection Observer refs for animations
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const presaleRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (content.updated_at) {
      setFormattedDate(new Date(content.updated_at).toLocaleDateString());
    }
  }, [content.updated_at]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add base animation class
          entry.target.classList.remove('opacity-0', 'translate-y-8');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          
          // Add stagger animation to children with animate-stagger class
          const staggerContainer = entry.target.querySelector('.animate-stagger');
          if (staggerContainer) {
            staggerContainer.classList.add('animate-in');
          }
        }
      });
    }, observerOptions);

    // Observe elements
    const elements = [heroRef.current, statsRef.current, presaleRef.current, featuresRef.current];
    elements.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      {/* Premium Cursor Effects */}
      {/* <CursorEffects
        showTrail
        showGlow
        showRipples
        color="#8b5cf6"
      /> */}
      
      {/* Ambient Particle Effects */}
      {/* <StarField className="fixed inset-0 z-0" /> */}
      
      {/* Accessibility: Skip to content link */}
      <a 
        href="#main-content" 
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>
      
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Cosmic Dust Overlay */}
        {/* <CosmicDust className="absolute inset-0 opacity-30" /> */}
        
        {/* Unified brand gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/5" />
        <div className="absolute inset-0" style={{
          background: `radial-gradient(circle at 30% 70%, rgba(255,0,122,0.08), transparent 50%), radial-gradient(circle at 70% 30%, rgba(244,114,182,0.06), transparent 50%)`
        }} />
        
        <ParallaxScroll speed={0.3} className="relative container-main section-y">
          <ScrollReveal direction="up" delay={200}>
            <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-primary/20 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
                <span className="text-brand-accent text-sm font-medium">Native XRPL Launchpad</span>
              </div>
              
              <h1 className="text-display-2xl heading-hero mb-6">
                {content.hero.title}
              </h1>
              <p className="text-body-enhanced text-slate-300 mx-auto mb-10 leading-relaxed">
                {content.hero.subtitle}
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-accent/15 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search projects, ask questions, or explore tools..."
                    className="search-input w-full"
                    aria-label="Search XRPL.Sale projects and tools"
                  />
                  <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-brand-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <div className="absolute inset-y-0 right-4 flex items-center">
                    <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-semibold text-slate-400 bg-slate-700/50 border border-slate-600 rounded">
                      Enter
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Popular Searches */}
            {content.popularSearches && (
              <div className="mb-12">
                <p className="text-sm text-slate-400 mb-4 font-medium">Popular searches:</p>
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                  {content.popularSearches.slice(0, 8).map((term, i) => (
                    <SearchButton key={i} term={term} />
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {content.hero.primaryCta && (
                <div>
                  <EnhancedButton
                    variant="primary"
                    size="xl"
                    magnetic
                    depth3D
                    glow
                    onClick={() => window.location.href = content.hero.primaryCta!.href}
                    className="text-lg px-8"
                  >
                    <span className="flex items-center gap-2">
                      {content.hero.primaryCta.label}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </EnhancedButton>
                </div>
              )}
              {content.hero.secondaryCta && (
                <div>
                  <EnhancedButton
                    variant="secondary"
                    size="xl"
                    magnetic
                    onClick={() => window.location.href = content.hero.secondaryCta!.href}
                    className="text-lg px-8"
                  >
                    {content.hero.secondaryCta.label}
                  </EnhancedButton>
                </div>
              )}
            </div>
            </div>
          </ScrollReveal>
        </ParallaxScroll>
      </section>

      <main id="main-content" className="container-main">
        {/* Stats */}
        {content.stats && (
          <ScrollReveal direction="up" delay={300}>
            <StatsSection stats={content.stats} />
          </ScrollReveal>
        )}

        {/* Enhanced XSALE Presale Section */}
        <ScrollReveal direction="up" delay={400}>
          <section className="section-y bg-gradient-to-br from-slate-800/20 via-brand-primary/5 to-slate-800/20 rounded-3xl border border-brand-primary/20 relative overflow-hidden">
            {/* Gentle floating particles for presale section */}
            <div className="absolute inset-0 opacity-20">
              {/* <CosmicDust particleCount={15} /> */}
            </div>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/30 rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse" />
              <span className="text-brand-accent font-medium">XSALE Presale • Live Now</span>
            </div>
            <h2 className="text-display-xl text-gradient-brand mb-6">
              Join the Platform Token Sale
            </h2>
            <p className="text-body-enhanced text-slate-300 max-w-4xl mx-auto mb-8">
              Get XSALE tokens with progressive tier pricing. Early investors receive better rates, revenue sharing, and governance rights in the future of XRPL launchpad.
            </p>
            
            {/* Value propositions */}
            <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-full border border-brand-primary/30">
                <div className="w-2 h-2 bg-brand-primary rounded-full" />
                <span className="text-sm text-brand-accent font-medium">Revenue Sharing</span>
              </div>
              <div className="flex items-center gap-2 bg-brand-accent/10 px-4 py-2 rounded-full border border-brand-accent/30">
                <div className="w-2 h-2 bg-brand-accent rounded-full" />
                <span className="text-sm text-brand-accent font-medium">Allocation Multipliers</span>
              </div>
              <div className="flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-full border border-brand-primary/30">
                <div className="w-2 h-2 bg-brand-primary rounded-full" />
                <span className="text-sm text-brand-accent font-medium">Premium Features</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* XSALE Presale Card */}
            {content.presale && content.presale.is_active && (
              <PresaleCard presale={content.presale} />
            )}

            {/* Regular Presale Info */}
            {presaleStatus && (
              <div className="lg:col-span-2">
                <Suspense fallback={<div className="text-center">Loading presale data...</div>}>
                  <PresaleInfo presaleStatus={presaleStatus} />
                </Suspense>
              </div>
            )}
          </div>
          </section>
        </ScrollReveal>

        {/* Enhanced Features Section */}
        <ScrollReveal direction="up" delay={500}>
          <section className="section-y">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/30 rounded-full px-4 py-2 mb-6">
              <span className="text-brand-accent text-sm font-medium">Platform Features</span>
            </div>
            <h2 className="text-display-xl text-gradient-brand mb-6">
              Complete Project Ecosystem
            </h2>
            <p className="text-body-enhanced text-slate-300 max-w-3xl mx-auto">
              Built for the XRPL ecosystem with native features, advanced security, and seamless user experience
            </p>
          </div>
          
          {content.features && (
            <StaggeredReveal
              staggerDelay={200}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
              {content.features.map((feature, i) => (
                <div key={i}>
                  <div 
                    className="glass-card p-8 rounded-2xl border-slate-700/30 group relative overflow-hidden card-tilt"
                    role="article"
                    aria-labelledby={`feature-${i}-title`}
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform float-gentle">
                          <span className="text-3xl" role="img" aria-hidden="true">
                            {feature.icon}
                          </span>
                        </div>
                        <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse-gentle" />
                      </div>
                      
                      <h3 
                        id={`feature-${i}-title`}
                        className="text-xl font-semibold mb-4 text-white group-hover:text-gradient-brand transition-all"
                      >
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed text-body-enhanced">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </StaggeredReveal>
          )}
          </section>
        </ScrollReveal>
      </main>

      {/* FAQ Section */}
      {content.faq && content.faq.length > 0 && (
        <ScrollReveal direction="up" delay={300}>
          <FAQSection faq={content.faq} />
        </ScrollReveal>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12">
        <div className="container-main">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              XRPL.Sale
            </h3>
            <p className="mt-4 text-slate-400">
              Native XRPL Launchpad Platform
            </p>
            <div className="mt-6 flex justify-center space-x-6">
              <a href="/docs" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Documentation
              </a>
              <a href="/api-reference" className="text-slate-400 hover:text-cyan-400 transition-colors">
                API Reference
              </a>
              <a href="/support" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Support
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700 text-slate-500 text-sm">
              <p>© 2025 XRPL.Sale. Built on XRP Ledger.</p>
              {formattedDate && (
                <p className="mt-2">Last updated: {formattedDate}</p>
              )}
              <p className="mt-1">Platform Version: {content.stats?.platform_version || '1.0.0'}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}