'use client';

import React from 'react';
import { ChangelogEntry as ChangelogEntryType } from '@/types';
import { ChangelogEntry } from './ChangelogEntry';
import { LoadingSpinner } from '@/components/ui';

interface ChangelogListProps {
  entries: ChangelogEntryType[];
  loading?: boolean;
  error?: string | null;
  showDetails?: boolean;
}

export function ChangelogList({ entries, loading = false, error = null, showDetails = false }: ChangelogListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-100 mb-1">
            Failed to load changelog
          </h3>
          <p className="text-gray-400 text-sm">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-500 mb-2 text-4xl">📋</div>
          <h3 className="text-lg font-medium text-gray-100 mb-1">
            No changelog entries found
          </h3>
          <p className="text-gray-400 text-sm">
            Try adjusting your search or filter criteria
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {entries.map((entry) => (
        <ChangelogEntry
          key={entry.id}
          entry={entry}
          showDetails={showDetails}
        />
      ))}
    </div>
  );
}