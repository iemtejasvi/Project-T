import { redirect, notFound } from "next/navigation";
import { primaryDB } from '@/lib/memoryDB';
import { unstable_cache } from 'next/cache';
import { normalizeNameSlug, sanitizeForPostgrestFilter } from '@/lib/nameUtils';
import NameArchiveClient from "./NameArchiveClient";

export const revalidate = 3600; // ISR: cache page shell for 1 hour

// Quick existence check — prevents garbage names from creating ISR cache entries
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
  { revalidate: 3600, tags: ['name-data'] }
);

interface NamePageProps {
  params: Promise<{ name: string }>;
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

  // Return 404 for names with zero messages — prevents ISR cache poisoning from garbage URLs
  const exists = await getCachedNameExists(lower);
  if (!exists) notFound();

  return <NameArchiveClient />;
}
