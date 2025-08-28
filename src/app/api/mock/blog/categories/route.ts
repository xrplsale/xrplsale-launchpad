import { NextResponse } from 'next/server';
import type { BlogCategory } from '@/types/blog';

const mockCategories: BlogCategory[] = [
  {
    id: 1,
    name: "Technical Architecture", 
    slug: "technical-architecture",
    description: "Deep dives into technical decisions and architecture patterns",
    article_count: 1
  },
  {
    id: 2,
    name: "XRPL Insights",
    slug: "xrpl-insights",
    description: "Analysis and updates from the XRPL ecosystem", 
    article_count: 0
  },
  {
    id: 3,
    name: "Platform Updates",
    slug: "platform-updates", 
    description: "Latest features and improvements to XRPL.Sale",
    article_count: 0
  },
  {
    id: 4,
    name: "DeFi Trends",
    slug: "defi-trends",
    description: "Insights from the broader DeFi ecosystem",
    article_count: 0
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return NextResponse.json({
    success: true,
    data: mockCategories
  });
}