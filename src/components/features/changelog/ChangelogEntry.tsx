'use client';

import React from 'react';
import { ChangelogEntry as ChangelogEntryType } from '@/types';
import { Badge } from '@/components/ui';
import { Card } from '@/components/ui';

interface ChangelogEntryProps {
  entry: ChangelogEntryType;
  showDetails?: boolean;
}

const changeTypeColors = {
  added: 'bg-green-500/20 text-green-400 border-green-500/30',
  changed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  deprecated: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  removed: 'bg-red-500/20 text-red-400 border-red-500/30',
  fixed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  security: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const changeTypeIcons = {
  added: '➕',
  changed: '🔧',
  deprecated: '⚠️',
  removed: '🗑️',
  fixed: '🐛',
  security: '🔒',
};

const versionTypeColors = {
  major: 'bg-red-500/20 text-red-400 border-red-500/30',
  minor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  patch: 'bg-green-500/20 text-green-400 border-green-500/30',
  hotfix: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const categoryColors = {
  feature: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  improvement: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  bugfix: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  security: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  breaking: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export function ChangelogEntry({ entry, showDetails = false }: ChangelogEntryProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-6 bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-white">
            v{entry.version}
          </h3>
          <Badge className={versionTypeColors[entry.type]}>
            {entry.type}
          </Badge>
          <Badge className={categoryColors[entry.category]}>
            {entry.category}
          </Badge>
        </div>
        <time className="text-sm text-gray-400" dateTime={entry.date}>
          {formatDate(entry.date)}
        </time>
      </div>

      <h4 className="text-lg font-medium text-gray-100 mb-2">
        {entry.title}
      </h4>

      {entry.description && (
        <p className="text-gray-300 mb-4">
          {entry.description}
        </p>
      )}

      <div className="space-y-3">
        {entry.changes.map((change) => (
          <div key={change.id} className="flex gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="flex-shrink-0">
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${changeTypeColors[change.type]}`}>
                <span>{changeTypeIcons[change.type]}</span>
                <span className="capitalize">{change.type}</span>
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-medium text-gray-100 text-sm">
                  {change.title}
                </h5>
                {change.component && (
                  <Badge className="bg-gray-600/40 text-gray-300 border-gray-600/50 text-xs">
                    {change.component}
                  </Badge>
                )}
                {change.breaking_change && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    Breaking
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-300 mb-2">
                {change.description}
              </p>
              
              {change.migration_notes && (
                <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                  <p className="text-xs text-yellow-300">
                    <strong>Migration:</strong> {change.migration_notes}
                  </p>
                </div>
              )}
              
              {change.related_issues && change.related_issues.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-400">Related issues:</span>
                  {change.related_issues.map((issue) => (
                    <button
                      key={issue}
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                      onClick={() => window.open(`https://github.com/issues/${issue}`, '_blank')}
                    >
                      #{issue}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showDetails && (entry.author || entry.pull_request || entry.commit_hash) && (
        <div className="mt-4 pt-4 border-t border-gray-700 flex items-center gap-4 text-sm text-gray-400">
          {entry.author && (
            <span>Author: {entry.author}</span>
          )}
          {entry.pull_request && (
            <button
              className="text-blue-400 hover:text-blue-300 hover:underline"
              onClick={() => window.open(`https://github.com/pulls/${entry.pull_request}`, '_blank')}
            >
              PR #{entry.pull_request}
            </button>
          )}
          {entry.commit_hash && (
            <button
              className="font-mono text-gray-400 hover:text-gray-300 hover:underline"
              onClick={() => window.open(`https://github.com/commit/${entry.commit_hash}`, '_blank')}
            >
              {entry.commit_hash.substring(0, 8)}
            </button>
          )}
        </div>
      )}
    </Card>
  );
}