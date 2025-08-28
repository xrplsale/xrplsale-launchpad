import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = {
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    per_page: searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : 10,
    version: searchParams.get('version'),
    type: searchParams.get('type')?.split(',') || undefined,
    category: searchParams.get('category')?.split(',') || undefined,
    dateFrom: searchParams.get('date_from'),
    dateTo: searchParams.get('date_to'),
    search: searchParams.get('search'),
  };

  const mockEntries = [
    {
      id: "entry-1",
      version: "2.1.0",
      date: "2024-12-20",
      title: "Major Platform Enhancement",
      description: "Enhanced user experience and new investment features",
      type: "major",
      category: "feature",
      author: "Development Team",
      pull_request: 156,
      commit_hash: "abc123def456",
      changes: [
        {
          id: "change-1",
          type: "added",
          title: "Advanced Portfolio Analytics",
          description: "Real-time portfolio tracking with detailed analytics and performance metrics",
          component: "Dashboard",
          breaking_change: false,
          related_issues: [45, 67]
        },
        {
          id: "change-2", 
          type: "changed",
          title: "Enhanced Investment Flow",
          description: "Streamlined investment process with better UX and faster confirmations",
          component: "Investment",
          breaking_change: false,
          related_issues: [23]
        },
        {
          id: "change-3",
          type: "fixed",
          title: "XRPL Connection Stability",
          description: "Improved connection reliability to XRPL network during high load",
          component: "Core",
          breaking_change: false,
          related_issues: [89, 91]
        }
      ]
    },
    {
      id: "entry-2",
      version: "2.0.5",
      date: "2024-12-15",
      title: "Security & Bug Fixes",
      description: "Important security updates and bug fixes",
      type: "patch",
      category: "security",
      author: "Security Team",
      pull_request: 142,
      commit_hash: "def789ghi012",
      changes: [
        {
          id: "change-4",
          type: "security",
          title: "Enhanced Authentication Security",
          description: "Strengthened wallet authentication with additional security measures",
          component: "Auth",
          breaking_change: false,
          related_issues: [78]
        },
        {
          id: "change-5",
          type: "fixed",
          title: "Mobile Responsive Issues",
          description: "Fixed various mobile display issues across different screen sizes",
          component: "UI",
          breaking_change: false,
          related_issues: [34, 56]
        }
      ]
    },
    {
      id: "entry-3",
      version: "2.0.0",
      date: "2024-12-01",
      title: "Next.js 15 Migration",
      description: "Major architecture upgrade to Next.js 15 with improved performance",
      type: "major",
      category: "breaking",
      author: "Architecture Team",
      pull_request: 125,
      commit_hash: "ghi345jkl678",
      changes: [
        {
          id: "change-6",
          type: "changed",
          title: "React 19 Upgrade",
          description: "Upgraded to React 19 for improved performance and new features",
          component: "Core",
          breaking_change: true,
          migration_notes: "Update React components to use new concurrent features",
          related_issues: [12, 15, 18]
        },
        {
          id: "change-7",
          type: "added",
          title: "Turbopack Support",
          description: "Added Turbopack for faster development and build times",
          component: "Build",
          breaking_change: false,
          related_issues: [20]
        },
        {
          id: "change-8",
          type: "removed",
          title: "Legacy API Endpoints",
          description: "Removed deprecated API endpoints from v1",
          component: "API",
          breaking_change: true,
          migration_notes: "Use new v2 API endpoints - see migration guide",
          related_issues: [25, 30]
        }
      ]
    }
  ];

  // Apply filtering
  let filteredEntries = [...mockEntries];
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredEntries = filteredEntries.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.description.toLowerCase().includes(searchTerm) ||
      entry.changes.some(change => 
        change.title.toLowerCase().includes(searchTerm) ||
        change.description.toLowerCase().includes(searchTerm)
      )
    );
  }

  if (params.type) {
    filteredEntries = filteredEntries.filter(entry =>
      params.type!.includes(entry.type)
    );
  }

  if (params.category) {
    filteredEntries = filteredEntries.filter(entry =>
      params.category!.includes(entry.category)
    );
  }

  if (params.version) {
    filteredEntries = filteredEntries.filter(entry =>
      entry.version === params.version
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      entries: filteredEntries,
      total: filteredEntries.length,
      page: params.page,
      per_page: params.per_page,
      has_next: false,
      has_prev: false,
      versions: ["2.1.0", "2.0.5", "2.0.0", "1.9.2", "1.9.1"]
    }
  });
}