import { Metadata } from 'next';
import { supabaseServer } from '@/lib/supabaseServer';
import MemoryDetailClient from './MemoryDetailClient';

interface MemoryRow {
  id: string;
  recipient: string;
  message: string;
  sender?: string | null;
  status: string;
}

async function getMemoryForMeta(id: string): Promise<MemoryRow | null> {
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) return null;

  const { data, error } = await supabaseServer
    .from('memories')
    .select('id, recipient, message, sender, status')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  if (data.status !== 'approved') return null;
  return data as MemoryRow;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const memory = await getMemoryForMeta(id);

  if (!memory) {
    return {
      title: 'Memory Not Found | If Only I Sent This',
      description: 'This memory could not be found or is no longer available.',
    };
  }

  const recipient = memory.recipient || 'Someone';
  const sender = memory.sender ? ` from ${memory.sender}` : '';
  const preview = memory.message.length > 160
    ? memory.message.slice(0, 157) + '...'
    : memory.message;

  const title = `To ${recipient}${sender} | If Only I Sent This`;
  const description = preview || `An unsent memory for ${recipient}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'If Only I Sent This',
      url: `https://www.ifonlyisentthis.com/memories/${id}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function MemoryDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <MemoryDetailClient id={id} />;
}
