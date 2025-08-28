import { NextResponse } from 'next/server';
import { getBlogArticles } from '@/lib/api-simple';

export async function GET() {
  try {
    const articles = await getBlogArticles({
      per_page: 50,
      featured: false
    });

    if (!articles?.articles?.length) {
      // Return empty RSS feed
      const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>XRPL.Sale Blog</title>
    <description>Latest XRPL insights and platform updates</description>
    <link>https://xrpl.sale/blog</link>
    <atom:link href="https://xrpl.sale/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`;

      return new NextResponse(rss, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    const rssItems = articles.articles.map(article => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.excerpt)}</description>
      <link>https://xrpl.sale/blog/${article.slug}</link>
      <guid isPermaLink="true">https://xrpl.sale/blog/${article.slug}</guid>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <author>${escapeXml(article.author)}</author>
      ${article.category ? `<category>${escapeXml(article.category.name)}</category>` : ''}
    </item>`).join('');

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>XRPL.Sale Blog</title>
    <description>Latest XRPL insights, platform updates, and DeFi trends from the XRPL.Sale team</description>
    <link>https://xrpl.sale/blog</link>
    <atom:link href="https://xrpl.sale/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('RSS generation failed:', error);
    
    // Return minimal RSS feed on error
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>XRPL.Sale Blog</title>
    <description>Latest XRPL insights and platform updates</description>
    <link>https://xrpl.sale/blog</link>
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=60'
      }
    });
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}