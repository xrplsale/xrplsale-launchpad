'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from '../Container';
import { Logo } from '@/components/shared/Logo';

interface FooterLink {
  name: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Platform',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' },
      { name: 'XSALE Presale', href: '/projects/0' },
      { name: 'How it Works', href: '/#how-it-works' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'Blog', href: '/blog' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Whitepaper', href: '/whitepaper.pdf', external: true },
      { name: 'XRPL.org', href: 'https://xrpl.org', external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { name: 'Discord', href: 'https://discord.gg/xrpl-sale', external: true },
      { name: 'Twitter/X', href: 'https://twitter.com/xrpl_sale', external: true },
      { name: 'Telegram', href: 'https://t.me/xrplsale', external: true },
      { name: 'GitHub', href: 'https://github.com/xrplsale', external: true },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/support' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Report Issues', href: '/support/issues' },
      { name: 'Feature Requests', href: '/support/features' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubscribing(true);
    setSubscriptionStatus('idle');

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubscriptionStatus('success');
      setEmail('');
    } catch {
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
    }

    // Reset status after 3 seconds
    setTimeout(() => setSubscriptionStatus('idle'), 3000);
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-black border-t border-slate-700/50">
      <Container>
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2 md:col-span-2">
              <Link href="/" className="inline-block mb-6 group">
                <Logo size="xl" variant="full" className="group-hover:drop-shadow-lg transition-all" />
              </Link>
              
              <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
                The premier XRPL-native launchpad platform enabling secure token sales 
                and presales with progressive tier access and community-driven governance.
              </p>
              
              {/* Key Features */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-slate-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                  <span>Built on XRP Ledger</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                  <span>Community-First Approach</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-300">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                  <span>Progressive Tier Access</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                <SocialLink href="https://twitter.com/xrpl_sale" label="Twitter/X">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://discord.gg/xrpl-sale" label="Discord">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://t.me/xrplsale" label="Telegram">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </SocialLink>
                <SocialLink href="https://github.com/xrplsale" label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </SocialLink>
              </div>
            </div>
            
            {/* Link Columns */}
            {footerSections.slice(0, 2).map((section) => (
              <div key={section.title} className="lg:col-span-1">
                <h3 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-cyan-400 transition-all duration-200 text-sm flex items-center group"
                        >
                          {link.name}
                          <svg
                            className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
            {/* Stay Updated & Community Combined Column */}
            <div className="lg:col-span-1 md:col-span-2 lg:col-span-1">
              {/* Stay Updated Section */}
              <div className="mb-8">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                  Stay Updated
                </h3>
                <p className="text-slate-400 text-xs mb-4">
                  Get platform updates delivered to your inbox.
                </p>
                
                {subscriptionStatus === 'success' ? (
                  <div className="flex items-center space-x-2 text-green-400 py-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-medium">Successfully subscribed!</span>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all text-xs"
                      required
                      disabled={isSubscribing}
                    />
                    <button 
                      type="submit"
                      disabled={isSubscribing || !email.trim()}
                      className="w-full px-3 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-medium rounded transition-all text-xs"
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>
                )}
                
                {subscriptionStatus === 'error' && (
                  <p className="text-red-400 text-xs mt-2">
                    Something went wrong. Please try again.
                  </p>
                )}
              </div>

              {/* Community Links */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
                  Community
                </h3>
                <ul className="space-y-3">
                  {footerSections[2].links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cyan-400 transition-all duration-200 text-sm flex items-center group"
                      >
                        {link.name}
                        <svg
                          className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 pt-8 pb-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-slate-500 text-sm">
              <div className="flex items-center space-x-2">
                <span>© {new Date().getFullYear()} XRPL.Sale</span>
                <span className="text-slate-600">•</span>
                <span>Built on XRP Ledger</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Network Status: Active</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/legal/privacy" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal/terms" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/legal/cookies" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/legal/disclaimer" className="text-slate-400 hover:text-cyan-400 transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// Social Link Component
interface SocialLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
}

function SocialLink({ href, label, children }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group w-11 h-11 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-slate-700/80 hover:shadow-lg hover:shadow-cyan-400/10 transition-all duration-300 transform hover:scale-110"
      aria-label={label}
    >
      <span className="group-hover:scale-110 transition-transform duration-200">{children}</span>
    </a>
  );
}