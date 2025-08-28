'use client';

import React, { useState } from 'react';
import { ChangelogFilters as ChangelogFiltersType } from '@/types';
import { Button } from '@/components/ui';

interface ChangelogFiltersProps {
  filters: ChangelogFiltersType;
  onFiltersChange: (filters: ChangelogFiltersType) => void;
  versions: string[];
}

const typeOptions: Array<{ value: 'major' | 'minor' | 'patch' | 'hotfix'; label: string; color: string }> = [
  { value: 'major', label: 'Major', color: 'text-red-400' },
  { value: 'minor', label: 'Minor', color: 'text-blue-400' },
  { value: 'patch', label: 'Patch', color: 'text-green-400' },
  { value: 'hotfix', label: 'Hotfix', color: 'text-orange-400' },
];

const categoryOptions: Array<{ value: 'feature' | 'improvement' | 'bugfix' | 'security' | 'breaking'; label: string; color: string }> = [
  { value: 'feature', label: 'Feature', color: 'text-emerald-400' },
  { value: 'improvement', label: 'Improvement', color: 'text-cyan-400' },
  { value: 'bugfix', label: 'Bug Fix', color: 'text-purple-400' },
  { value: 'security', label: 'Security', color: 'text-orange-400' },
  { value: 'breaking', label: 'Breaking', color: 'text-red-400' },
];

export function ChangelogFilters({ filters, onFiltersChange, versions }: ChangelogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (updates: Partial<ChangelogFiltersType>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  const toggleArrayFilter = (key: 'type' | 'category', value: string) => {
    const currentArray = (filters[key] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [key]: newArray.length > 0 ? newArray : undefined });
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-100">Filters</h3>
          {hasActiveFilters && (
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-400 hover:text-gray-300"
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-300"
          >
            {isExpanded ? '▲' : '▼'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search changelog entries..."
          value={filters.search || ''}
          onChange={(e) => updateFilters({ search: e.target.value || undefined })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* Version Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Version
            </label>
            <select
              value={filters.version || ''}
              onChange={(e) => updateFilters({ version: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All versions</option>
              {versions.map((version) => (
                <option key={version} value={version}>
                  v{version}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Release Type
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleArrayFilter('type', option.value)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    filters.type?.includes(option.value)
                      ? `${option.color} bg-current/20 border-current/30`
                      : 'text-gray-400 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleArrayFilter('category', option.value)}
                  className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                    filters.category?.includes(option.value)
                      ? `${option.color} bg-current/20 border-current/30`
                      : 'text-gray-400 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => updateFilters({ dateFrom: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => updateFilters({ dateTo: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}