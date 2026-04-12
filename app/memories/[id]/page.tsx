import { notFound } from 'next/navigation';
import MemoryDetailClient from './MemoryDetailClient';
import { sanitizeUUID } from '@/lib/inputSanitizer';

export const revalidate = 120; // ISR: cache page shell for 2 minutes

export default async function MemoryDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Reject non-UUID IDs immediately — no DB query, cached 404
  if (!sanitizeUUID(id)) notFound();

  return <MemoryDetailClient id={id} />;
}
