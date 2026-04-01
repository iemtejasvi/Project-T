import MemoryDetailClient from './MemoryDetailClient';

export default async function MemoryDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <MemoryDetailClient id={id} />;
}
