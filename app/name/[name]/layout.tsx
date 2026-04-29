import { Metadata } from 'next';
import { primaryDB } from '@/lib/memoryDB';
import { unstable_cache } from 'next/cache';
import { normalizeNameSlug, sanitizeForPostgrestFilter } from '@/lib/nameUtils';

interface NameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
}

// ISR cache: count of approved memories for a name (revalidate every 5hr)
const getCachedNameCount = unstable_cache(
  async (slug: string) => {
    const nowIso = new Date().toISOString();
    const safeSlug = sanitizeForPostgrestFilter(slug);
    const { count, error } = await primaryDB
      .from('memories')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
      .or(`recipient.ilike.${safeSlug},sender.ilike.${safeSlug}`);
    if (error) return 0;
    return count || 0;
  },
  ['name-count'],
  { revalidate: 18000, tags: ['name-data'] }
);

export async function generateMetadata({ params }: NameLayoutProps): Promise<Metadata> {
  const { name: rawSlug } = await params;
  const slug = normalizeNameSlug(rawSlug);
  const displayName = slug
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const title = `Messages to ${displayName}`;
  const ogTitle = `Messages to ${displayName} .  If Only I Sent This`;
  const description = `Read unsent messages, anonymous letters, and confessions written to ${displayName}. Discover the words people never had the courage to send.`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      url: `https://www.ifonlyisentthis.com/name/${encodeURIComponent(slug)}`,
      siteName: 'If Only I Sent This',
      type: 'website',
      images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: `Messages to ${displayName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: ['/opengraph-image.png'],
    },
    alternates: {
      canonical: `/name/${encodeURIComponent(slug)}`,
    },
  };
}

export default async function NameLayout({ children, params }: NameLayoutProps) {
  const { name: rawSlug } = await params;
  const slug = normalizeNameSlug(rawSlug);
  const displayName = slug
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const count = await getCachedNameCount(slug);

  const structuredData = count > 0 ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Messages to ${displayName} .  If Only I Sent This`,
    description: `Read ${count} unsent messages and letters to ${displayName}. Anonymous confessions, love letters, and words never spoken.`,
    url: `https://www.ifonlyisentthis.com/name/${encodeURIComponent(slug)}`,
    isPartOf: {
      "@type": "WebSite",
      name: "If Only I Sent This",
      url: "https://www.ifonlyisentthis.com",
    },
    numberOfItems: count,
  }).replace(/</g, '\\u003c') : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: structuredData }}
        />
      )}
      {children}
    </>
  );
}
