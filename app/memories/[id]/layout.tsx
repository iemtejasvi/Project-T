import { Metadata } from 'next';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

interface MemoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
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

const FALLBACK_TITLE = "Unsent Memory – If Only I Sent This";
const FALLBACK_DESC = "Read this anonymous unsent message on If Only I Sent This — a sanctuary for words that were never sent.";

// ISR cache: one DB hit per memory ID per 60s across all visitors.
const getCachedMemoryMeta = unstable_cache(
  async (id: string) => {
    const supabase = getSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('memories')
      .select('recipient, message, status, reveal_at')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error || !data) return null;
    return data;
  },
  ['memory-meta'],
  { revalidate: 60, tags: ['memories-feed'] }
);

export async function generateMetadata({ params }: MemoryLayoutProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const data = await getCachedMemoryMeta(id);

    if (!data) {
      return { title: FALLBACK_TITLE, description: FALLBACK_DESC, robots: { index: false, follow: true } };
    }

    // Don't expose metadata for unrevealed time capsules
    if (data.reveal_at && new Date(data.reveal_at).getTime() > Date.now()) {
      return { title: FALLBACK_TITLE, description: FALLBACK_DESC, robots: { index: false, follow: true } };
    }

    const recipient = data.recipient || 'Someone';
    const displayRecipient = recipient
      .split(' ')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    // Truncate message for description preview
    const rawMessage = (data.message || '').replace(/\s+/g, ' ').trim();
    const preview = rawMessage.length > 120
      ? rawMessage.substring(0, 120).trim() + '…'
      : rawMessage;

    const longTitle = `Unsent Message to ${displayRecipient} – If Only I Sent This`;
    const shortTitle = `To ${displayRecipient} – If Only I Sent This`;
    const title = longTitle.length > 60 ? shortTitle : longTitle;

    const description = preview
      ? `"${preview}" — An anonymous unsent letter on If Only I Sent This.`
      : FALLBACK_DESC;

    return {
      title,
      description,
      alternates: {
        canonical: `/memories/${id}`,
      },
      openGraph: {
        title: longTitle,
        description,
        url: `https://www.ifonlyisentthis.com/memories/${id}`,
        siteName: 'If Only I Sent This',
        type: 'article',
        images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: title }],
      },
      twitter: {
        card: 'summary',
        title: longTitle,
        description,
        images: ['/opengraph-image.png'],
      },
    };
  } catch {
    return { title: FALLBACK_TITLE, description: FALLBACK_DESC, robots: { index: false, follow: true } };
  }
}

export default function MemoryDetailLayout({ children }: MemoryLayoutProps) {
  return <>{children}</>;
}
