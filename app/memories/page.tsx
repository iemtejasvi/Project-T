import { unstable_cache } from 'next/cache';
import { fetchMemoriesPaginated, redactIfDestructed, redactIfUnrevealed, isNightOnlyVisibleNow } from '@/lib/memoryDB';
import MemoriesClient from './MemoriesClient';
import type { Memory } from '@/types/memory';

export const revalidate = 60;

const getArchiveMemories = unstable_cache(
  async () => {
    const result = await fetchMemoriesPaginated(0, 18, { status: 'approved' }, '', { created_at: 'desc' });
    if (!result.data) return { memories: [], totalCount: 0 };
    const memories = result.data
      .map((m: Memory) => redactIfDestructed(m))
      .map((m: Memory) => redactIfUnrevealed(m))
      .filter((m: Memory) => isNightOnlyVisibleNow(m));
    return { memories, totalCount: result.totalCount || 0 };
  },
  ['archive-memories'],
  { revalidate: 60, tags: ['memories-feed'] }
);

export default async function MemoriesPage() {
  let initialMemories: Memory[] = [];
  let initialTotalCount = 0;
  try {
    const result = await getArchiveMemories();
    initialMemories = result.memories;
    initialTotalCount = result.totalCount;
  } catch {
    // Fallback to empty — MemoriesClient will fetch client-side
  }

  return <MemoriesClient initialMemories={initialMemories} initialTotalCount={initialTotalCount} />;
}
