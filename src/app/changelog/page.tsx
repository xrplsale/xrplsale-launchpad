'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '@/components/layout';
import { ChangelogList, ChangelogFilters } from '@/components/features';
import { getChangelog } from '@/lib/api-simple';
import { ChangelogFilters as ChangelogFiltersType, ChangelogListResponse } from '@/types';

export default function ChangelogPage() {
  const [data, setData] = useState<ChangelogListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChangelogFiltersType>({});

  const loadChangelog = async (currentFilters: ChangelogFiltersType) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        ...currentFilters,
        per_page: 20
      };
      
      const response = await getChangelog(params);
      
      if (response?.success) {
        setData(response.data);
      } else {
        setError(response?.error || 'Failed to load changelog');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load changelog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChangelog(filters);
  }, [filters]);

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 border-b border-gray-800">
        <Container>
          <div className="py-16 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Platform Changelog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Track all updates, improvements, and changes to the XRPL.Sale platform.
              Stay informed about new features and enhancements.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <ChangelogFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  versions={data?.versions || []}
                />
              </div>
            </div>

            {/* Main Content - Changelog List */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-semibold text-white">
                    Release History
                  </h2>
                  {data && !loading && (
                    <span className="text-sm text-gray-400">
                      {data.total} {data.total === 1 ? 'release' : 'releases'}
                    </span>
                  )}
                </div>
                
                {/* RSS/Subscribe options could go here */}
                <div className="flex items-center gap-2">
                  <button className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                    📡 RSS Feed
                  </button>
                </div>
              </div>

              <ChangelogList
                entries={data?.entries || []}
                loading={loading}
                error={error}
                showDetails={true}
              />

              {/* Pagination would go here if needed */}
              {data && data.has_next && (
                <div className="mt-8 flex justify-center">
                  <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors">
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}