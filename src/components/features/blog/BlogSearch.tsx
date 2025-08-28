'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BlogSearchProps {
  initialQuery?: string;
  placeholder?: string;
}

export function BlogSearch({ 
  initialQuery = '', 
  placeholder = 'Search articles...' 
}: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        />
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>
      
      {/* Search button for mobile */}
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium rounded-md hover:shadow-lg transition-all"
      >
        Search
      </button>
    </form>
  );
}