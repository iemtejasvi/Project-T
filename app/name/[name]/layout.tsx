import { Metadata } from 'next';
import { primaryDB } from '@/lib/memoryDB';
import { unstable_cache } from 'next/cache';
import { normalizeNameSlug, sanitizeForPostgrestFilter } from '@/lib/nameUtils';

interface NameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
}

// ISR cache: count of approved memories for a name (revalidate every 2 min)
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
  { revalidate: 120, tags: ['name-data'] }
);

export async function generateMetadata({ params }: NameLayoutProps): Promise<Metadata> {
  const { name: rawSlug } = await params;
  const slug = normalizeNameSlug(rawSlug);
  const displayName = slug
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const title = `Messages to ${displayName} – If Only I Sent This`;
  const description = `Read unsent messages, anonymous letters, and confessions written to ${displayName}. Discover the words people never had the courage to send.`;

  // Server-side noindex for thin content pages (fewer than 3 messages)
  const count = await getCachedNameCount(slug);
  const robotsDirective = count < 3
    ? { index: false, follow: true }
    : undefined;

  return {
    title,
    description,
    ...(robotsDirective ? { robots: robotsDirective } : {}),
    openGraph: {
      title,
      description,
      url: `https://www.ifonlyisentthis.com/name/${encodeURIComponent(slug)}`,
      siteName: 'If Only I Sent This',
      type: 'website',
      images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: `Messages to ${displayName}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/opengraph-image.png'],
    },
    alternates: {
      canonical: `https://www.ifonlyisentthis.com/name/${encodeURIComponent(slug)}`,
    },
  };
}

export default function NameLayout({ children }: NameLayoutProps) {
  return <>{children}</>;
}
