import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ version: string }> }
) {
  const { version } = await params;

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

  const entry = mockEntries.find(e => e.version === version);
  
  if (!entry) {
    return NextResponse.json({
      success: false,
      error: `Changelog entry for version ${version} not found`
    }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: { entry }
  });
}