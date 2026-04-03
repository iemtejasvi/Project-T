import { Metadata } from 'next';
import { primaryDB } from '@/lib/memoryDB';
import { unstable_cache } from 'next/cache';

interface MemoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const FALLBACK_TITLE = "Unsent Memory";
const FALLBACK_DESC = "Read this anonymous unsent message on If Only I Sent This — a sanctuary for words that were never sent.";

// ISR cache: one DB hit per memory ID per 60s across all visitors.
const getCachedMemoryMeta = unstable_cache(
  async (id: string) => {
    const { data, error } = await primaryDB
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

    const longTitle = `Unsent Message to ${displayRecipient}`;
    const shortTitle = `To ${displayRecipient}`;
    const title = longTitle.length > 60 ? shortTitle : longTitle;

    const ogTitle = `Unsent Message to ${displayRecipient} – If Only I Sent This`;

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
        title: ogTitle,
        description,
        url: `https://www.ifonlyisentthis.com/memories/${id}`,
        siteName: 'If Only I Sent This',
        type: 'article',
        images: [{ url: '/opengraph-image.png', width: 800, height: 533, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
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
