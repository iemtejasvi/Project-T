import { Metadata } from 'next';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { normalizeNameSlug } from '@/lib/nameUtils';

interface NameLayoutProps {
  children: React.ReactNode;
  params: Promise<{ name: string }>;
}

// Module-level singleton — reused across requests in the same Lambda
let _supabase: SupabaseClient | null | undefined;
function getSupabase() {
  if (_supabase !== undefined) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) { _supabase = null; return null; }
  _supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _supabase;
}

// ISR cache: count of approved memories for a name (revalidate every 2 min)
const getCachedNameCount = unstable_cache(
  async (slug: string) => {
    const supabase = getSupabase();
    if (!supabase) return 0;
    const nowIso = new Date().toISOString();
    const { count, error } = await supabase
      .from('memories')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
      .or(`recipient.ilike.${slug},sender.ilike.${slug}`);
    if (error) return 0;
    return count || 0;
  },
  ['name-count'],
  { revalidate: 120, tags: ['memories-feed'] }
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
