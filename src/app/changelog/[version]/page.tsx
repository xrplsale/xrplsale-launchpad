'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout';
import { ChangelogEntry } from '@/components/features';
import { Button } from '@/components/ui';
import { getChangelogEntry } from '@/lib/api-simple';
import { ChangelogEntry as ChangelogEntryType } from '@/types';

export default function ChangelogVersionPage() {
  const params = useParams();
  const router = useRouter();
  const version = params.version as string;
  
  const [entry, setEntry] = useState<ChangelogEntryType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntry = async () => {
      if (!version) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getChangelogEntry(version);
        
        if (response?.success) {
          setEntry(response.data.entry);
        } else {
          setError(response?.error || 'Changelog entry not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load changelog entry');
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [version]);

  if (loading) {
    return (
      <Container>
        <div className="py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Container>
    );
  }

  if (error || !entry) {
    return (
      <Container>
        <div className="py-16 text-center">
          <div className="text-red-400 mb-4 text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Changelog Entry Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            {error || `Version ${version} could not be found.`}
          </p>
          <Button onClick={() => router.push('/changelog')}>
            ← Back to Changelog
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-b border-gray-800">
        <Container>
          <div className="py-12">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/changelog')}
                className="text-gray-400 hover:text-gray-300"
              >
                ← Back to Changelog
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Version {entry.version}
              </h1>
              <p className="text-xl text-gray-300">
                {entry.title}
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-400">
                <span>Released on {new Date(entry.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
                <span>•</span>
                <span>By {entry.author}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Content */}
      <Container>
        <div className="py-8">
          <div className="max-w-4xl mx-auto">
            <ChangelogEntry
              entry={entry}
              showDetails={true}
            />
            
            {/* Navigation to other versions */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-100 mb-2">
                    Explore Other Versions
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Check out other platform releases and updates
                  </p>
                </div>
                <Button onClick={() => router.push('/changelog')}>
                  View All Releases
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}