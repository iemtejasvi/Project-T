import MemoryDetailClient from './MemoryDetailClient';

export const revalidate = 120; // ISR: cache page shell for 2 minutes

export default async function MemoryDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <MemoryDetailClient id={id} />;
}
