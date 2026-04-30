import { redirect, notFound } from "next/navigation";
import type { Metadata } from 'next';
import { primaryDB } from '@/lib/memoryDB';
import { unstable_cache } from 'next/cache';
import { normalizeNameSlug, sanitizeForPostgrestFilter } from '@/lib/nameUtils';
import NameArchiveClient from "./NameArchiveClient";

export const revalidate = 18000; // ISR: cache page shell for 5 hours

// Quick existence check .  prevents garbage names from creating ISR cache entries
const getCachedNameExists = unstable_cache(
  async (slug: string) => {
    const safeSlug = sanitizeForPostgrestFilter(slug);
    const { count } = await primaryDB
      .from('memories')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .or(`recipient.ilike.${safeSlug},sender.ilike.${safeSlug}`)
      .limit(1);
    return (count || 0) > 0;
  },
  ['name-exists'],
  { revalidate: 18000, tags: ['name-data'] }
);

interface NamePageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: NamePageProps): Promise<Metadata> {
  const { name: rawSlug } = await params;
  const slug = normalizeNameSlug(rawSlug);
  const displayName = slug
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const title = `Unsent Letters to ${displayName}`;
  const description = `Read unsent letters and anonymous confessions written for ${displayName}. Share the messages you never spoke on If Only I Sent This.`;
  const path = `/name/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | If Only I Sent This`,
      description,
      url: `https://www.ifonlyisentthis.com${path}`,
      siteName: 'If Only I Sent This',
      type: 'website',
      images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | If Only I Sent This`,
      description,
      images: ['/opengraph-image.png'],
    },
  };
}

export default async function NamePage({ params }: NamePageProps) {
  const { name: rawSlug } = await params;
  const decoded = decodeURIComponent(rawSlug);
  const lower = decoded.toLowerCase().trim();

  // 308 permanent redirect non-lowercase slugs to canonical lowercase URL
  if (decoded !== lower) {
    redirect(`/name/${encodeURIComponent(lower)}`);
  }

  // Block name length to prevent cache key explosion (reasonable name max: 100 chars)
  if (lower.length > 100) notFound();

  // Return 404 for names with zero messages .  prevents ISR cache poisoning from garbage URLs
  const exists = await getCachedNameExists(lower);
  if (!exists) notFound();

  return <NameArchiveClient />;
}
