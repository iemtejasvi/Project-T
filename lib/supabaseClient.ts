import { createClient } from '@supabase/supabase-js';

// First Supabase instance
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Second Supabase instance
export const supabase2 = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_2!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_2!
);

// Counter to track which database to use next
let dbCounter = 0;

// Function to get the next database instance for memories
export function getNextMemoryDb() {
  dbCounter = (dbCounter + 1) % 2;
  return dbCounter === 0 ? supabase : supabase2;
}

// Function to get all memories from both databases
export async function getAllMemories(query: any = {}) {
  try {
    // Fetch from both databases
    const [result1, result2] = await Promise.all([
      supabase
        .from("memories")
        .select("*")
        .match(query)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase2
        .from("memories")
        .select("*")
        .match(query)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
    ]);

    // Combine and deduplicate results
    const allMemories = [...(result1.data || []), ...(result2.data || [])];
    const uniqueMemories = Array.from(
      new Map(allMemories.map(memory => [memory.id, memory])).values()
    );

    // Sort combined results
    return uniqueMemories.sort((a, b) => {
      // First sort by pinned status
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then by creation date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return [];
  }
}

// Function to get memory count from both databases
export async function getMemoryCount(query: any) {
  const [result1, result2] = await Promise.all([
    supabase.from('memories').select('*', { count: 'exact' }).match(query),
    supabase2.from('memories').select('*', { count: 'exact' }).match(query)
  ]);

  if (result1.error) throw result1.error;
  if (result2.error) throw result2.error;

  return (result1.count || 0) + (result2.count || 0);
} 