// lib/dualMemoryDB.ts
import { createClient } from "@supabase/supabase-js";

// Database configurations
const dbA = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  client: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
};

const dbB = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL_B!,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_B!,
  client: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_B!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_B!)
};

// Stateless round-robin selector (avoids serverless cold-start resets)
function getNextDatabase(): 'A' | 'B' {
  // Alternate based on current time parity to distribute writes without relying on process state
  return (Date.now() % 2 === 0) ? 'A' : 'B';
}

// Count statuses per DB
export async function getStatusCounts() {
  const statuses = ["pending", "approved", "banned"] as const;
  type Status = typeof statuses[number];
  type Counts = Record<Status, number | null>;
  const now = new Date().toISOString(); // not used here but reserved for potential future constraints

  async function countsFor(db: typeof dbA): Promise<Counts> {
    const entries = await Promise.all(statuses.map(async (s) => {
      const res = await db.client
        .from('memories')
        .select('id', { count: 'exact', head: true })
        .eq('status', s);
      const count = (res as unknown as { count: number | null }).count ?? null;
      return [s, count] as const;
    }));
    return Object.fromEntries(entries) as Counts;
  }

  const [A, B] = await Promise.all([countsFor(dbA), countsFor(dbB)]);
  return { A, B };
}

// Measure a simple latency for each DB (ms)
export async function measureDbLatency() {
  function nowMs() {
    if (typeof performance !== 'undefined' && performance.now) return performance.now();
    return Date.now();
  }
  async function ping(db: typeof dbA) {
    const t0 = nowMs();
    await db.client.from('memories').select('id').limit(1);
    const t1 = nowMs();
    return t1 - t0;
  }
  const [A, B] = await Promise.all([ping(dbA), ping(dbB)]);
  return { A, B };
}

// Count expired pinned across both DBs
export async function getExpiredPinnedCount() {
  const now = new Date().toISOString();
  const [resA, resB] = await Promise.all([
    dbA.client.from('memories').select('id', { count: 'exact', head: true }).eq('pinned', true).lte('pinned_until', now),
    dbB.client.from('memories').select('id', { count: 'exact', head: true }).eq('pinned', true).lte('pinned_until', now),
  ]);
  const A = (resA as unknown as { count: number | null }).count ?? 0;
  const B = (resB as unknown as { count: number | null }).count ?? 0;
  return { A, B, total: (A || 0) + (B || 0) };
}

// Unpin all expired pins across both DBs
export async function unpinExpiredMemories(): Promise<number> {
  const now = new Date().toISOString();
  const [idsARes, idsBRes] = await Promise.all([
    dbA.client.from('memories').select('id').eq('pinned', true).lte('pinned_until', now),
    dbB.client.from('memories').select('id').eq('pinned', true).lte('pinned_until', now),
  ]);
  const idsA = (idsARes.data || []).map(r => r.id as string);
  const idsB = (idsBRes.data || []).map(r => r.id as string);
  const unique = Array.from(new Set([...idsA, ...idsB]));
  if (unique.length === 0) return 0;
  await Promise.all(unique.map(id => updateMemory(id, { pinned: false, pinned_until: undefined })));
  return unique.length;
}

// Simulate n round-robin selections using current time parity
export function simulateRoundRobin(n = 20) {
  const start = Date.now();
  const picks: Array<'A' | 'B'> = [];
  for (let i = 0; i < n; i++) {
    const pick = ((start + i) % 2 === 0) ? 'A' : 'B';
    picks.push(pick);
  }
  const A = picks.filter(p => p === 'A').length;
  const B = picks.length - A;
  return { picks, A, B };
}

// Interface for memory data
interface MemoryData {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  status: string;
  color: string;
  full_bg: boolean;
  animation?: string;
  ip?: string;
  country?: string;
  uuid?: string;
  tag?: string;
  sub_tag?: string;
  created_at: string;
  pinned?: boolean;
  pinned_until?: string;
  typewriter_enabled?: boolean;
  [key: string]: string | boolean | undefined;
}

// Test database connectivity
async function testDatabaseConnection(db: typeof dbA): Promise<boolean> {
  try {
    const { error } = await db.client
      .from('memories')
      .select('id')
      .limit(1);
    return !error;
  } catch (err) {
    console.error('Database connection test failed:', err);
    return false;
  }
}

// Helper function to clean memory data (convert null to undefined)
function cleanMemoryData(data: Record<string, unknown>): MemoryData {
  const cleaned = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value === null ? undefined : value])
  );
  return cleaned as MemoryData;
}

// Insert memory with round-robin and failover
export async function insertMemory(memoryData: Record<string, unknown>, preferred?: 'A' | 'B') {
  const cleanedData = cleanMemoryData(memoryData);
  const primaryDB = preferred ?? getNextDatabase();
  const secondaryDB = primaryDB === 'A' ? 'B' : 'A';
  
  const primaryClient = primaryDB === 'A' ? dbA : dbB;
  const secondaryClient = secondaryDB === 'A' ? dbA : dbB;
  
  console.log(`Attempting to write to database ${primaryDB} first`);
  
  // Try primary database first
  try {
    const { data, error } = await primaryClient.client
      .from('memories')
      .insert([cleanedData])
      .select()
      .single();
      
    if (!error && data) {
      console.log(`Successfully wrote to database ${primaryDB}`);
      return { data, error: null, database: primaryDB };
    } else {
      throw new Error(error?.message || 'Unknown error');
    }
  } catch (primaryError) {
    console.error(`Failed to write to database ${primaryDB}:`, primaryError);
    
    // Failover to secondary database
    console.log(`Failing over to database ${secondaryDB}`);
    try {
      const { data, error } = await secondaryClient.client
        .from('memories')
        .insert([cleanedData])
        .select()
        .single();
        
      if (!error && data) {
        console.log(`Successfully wrote to database ${secondaryDB} (failover)`);
        return { data, error: null, database: secondaryDB };
      } else {
        throw new Error(error?.message || 'Unknown error');
      }
    } catch (secondaryError) {
      console.error(`Failed to write to database ${secondaryDB}:`, secondaryError);
      return { 
        data: null, 
        error: { 
          message: `Both databases failed. Primary: ${primaryError}. Secondary: ${secondaryError}` 
        }, 
        database: null 
      };
    }
  }
}

// Fetch memories from both databases with unified results
export async function fetchMemories(filters: Record<string, string> = {}, orderBy: Record<string, string> = {}) {
  const [resultA, resultB] = await Promise.allSettled([
    dbA.client.from('memories').select('*'),
    dbB.client.from('memories').select('*')
  ]);
  
  let memoriesA: MemoryData[] = [];
  let memoriesB: MemoryData[] = [];
  
  if (resultA.status === 'fulfilled' && !resultA.value.error) {
    memoriesA = (resultA.value.data || []).map(cleanMemoryData);
  } else {
    console.error('Error fetching from database A:', resultA.status === 'fulfilled' ? resultA.value.error : resultA.reason);
  }
  
  if (resultB.status === 'fulfilled' && !resultB.value.error) {
    memoriesB = (resultB.value.data || []).map(cleanMemoryData);
  } else {
    console.error('Error fetching from database B:', resultB.status === 'fulfilled' ? resultB.value.error : resultB.reason);
  }
  
  // Combine and sort results
  const allMemories = [...memoriesA, ...memoriesB];
  
  // Apply filters
  let filteredMemories = allMemories;
  if (filters.status) {
    filteredMemories = filteredMemories.filter(m => m.status === filters.status);
  }
  if (filters.id) {
    filteredMemories = filteredMemories.filter(m => m.id === filters.id);
  }
  if (filters.ip) {
    filteredMemories = filteredMemories.filter(m => m.ip === filters.ip);
  }
  if (filters.uuid) {
    filteredMemories = filteredMemories.filter(m => m.uuid === filters.uuid);
  }
  if (typeof filters.pinned !== 'undefined') {
    const pinnedFlag = String(filters.pinned).toLowerCase() === 'true';
    filteredMemories = filteredMemories.filter(m => Boolean(m.pinned) === pinnedFlag);
  }
  
  // Apply ordering - pinned first, then by created_at
  filteredMemories.sort((a, b) => {
    // First sort by pinned status (pinned items first)
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then sort by created_at
    if (orderBy.created_at) {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return orderBy.created_at === 'desc' ? dateB - dateA : dateA - dateB;
    }
    
    return 0;
  });
  
  // Fire-and-forget: auto-unpin any expired pinned memories we just fetched
  try {
    const nowTs = Date.now();
    const expired = allMemories.filter(m => m.pinned && m.pinned_until && new Date(m.pinned_until).getTime() <= nowTs);
    if (expired.length > 0) {
      // De-duplicate by id
      const ids = Array.from(new Set(expired.map(m => m.id)));
      // Do not await to avoid blocking UI; errors are logged by updateMemory
      Promise.all(ids.map(id => updateMemory(id, { pinned: false, pinned_until: undefined })) ).catch(() => {});
    }
  } catch {}

  return { data: filteredMemories, error: null };
}

// Count memories from both databases
export async function countMemories(filters: Record<string, string> = {}) {
  const { data } = await fetchMemories(filters);
  return { count: data.length, error: null };
}

// Get counts per database independently
export async function getDatabaseCounts() {
  try {
    const [resA, resB] = await Promise.all([
      dbA.client.from('memories').select('id', { count: 'exact', head: true }),
      dbB.client.from('memories').select('id', { count: 'exact', head: true })
    ]);

    const countA = (resA as unknown as { count: number | null }).count ?? null;
    const countB = (resB as unknown as { count: number | null }).count ?? null;

    return { A: countA as number | null, B: countB as number | null, error: null };
  } catch (err) {
    console.error('Error getting database counts:', err);
    return { A: null, B: null, error: err };
  }
}

// Fetch recent memories across both DBs ordered purely by created_at desc
export async function fetchRecentMemories(limit = 10): Promise<Array<{ id: string; created_at: string }>> {
  try {
    const [resA, resB] = await Promise.all([
      dbA.client.from('memories').select('id, created_at'),
      dbB.client.from('memories').select('id, created_at')
    ]);

    type Row = { id: string; created_at: string | null };
    const a = ((resA.data || []) as Row[]);
    const b = ((resB.data || []) as Row[]);
    const all = [...a, ...b]
      .filter((m): m is { id: string; created_at: string } => typeof m.created_at === 'string' && m.created_at.length > 0)
      .sort((m1, m2) => new Date(m2.created_at).getTime() - new Date(m1.created_at).getTime())
      .slice(0, limit);

    return all;
  } catch (err) {
    console.error('Error fetching recent memories for health view:', err);
    return [];
  }
}

// Determine which database currently holds a memory by ID
export async function locateMemory(id: string): Promise<'A' | 'B' | 'Both' | 'Unknown'> {
  try {
    const [resA, resB] = await Promise.all([
      dbA.client.from('memories').select('id').eq('id', id).limit(1),
      dbB.client.from('memories').select('id').eq('id', id).limit(1)
    ]);

    const inA = !resA.error && (resA.data?.length || 0) > 0;
    const inB = !resB.error && (resB.data?.length || 0) > 0;

    if (inA && inB) return 'Both';
    if (inA) return 'A';
    if (inB) return 'B';
    return 'Unknown';
  } catch (err) {
    console.error('Error locating memory across DBs:', err);
    return 'Unknown';
  }
}

// Update memory in both databases (finds the record first)
export async function updateMemory(id: string, updates: Partial<Omit<MemoryData, 'id'>>) {
  const updatePromises = [
    dbA.client.from('memories').update(updates).eq('id', id).select(),
    dbB.client.from('memories').update(updates).eq('id', id).select()
  ];
  
  const [resultA, resultB] = await Promise.allSettled(updatePromises);
  
  // Check which database had the record and was updated successfully
  let updatedData = null;
  let error = null;
  
  if (resultA.status === 'fulfilled' && !resultA.value.error && resultA.value.data?.length > 0) {
    updatedData = resultA.value.data[0];
  } else if (resultB.status === 'fulfilled' && !resultB.value.error && resultB.value.data?.length > 0) {
    updatedData = resultB.value.data[0];
  } else {
    error = { message: 'Memory not found in either database or update failed' };
  }
  
  return { data: updatedData, error };
}

// Delete memory from both databases
export async function deleteMemory(id: string) {
  const deletePromises = [
    dbA.client.from('memories').delete().eq('id', id).select(),
    dbB.client.from('memories').delete().eq('id', id).select()
  ];
  
  const [resultA, resultB] = await Promise.allSettled(deletePromises);
  
  // Check which database had the record and was deleted successfully
  let deletedData = null;
  let error = null;
  
  if (resultA.status === 'fulfilled' && !resultA.value.error && resultA.value.data?.length > 0) {
    deletedData = resultA.value.data[0];
  } else if (resultB.status === 'fulfilled' && !resultB.value.error && resultB.value.data?.length > 0) {
    deletedData = resultB.value.data[0];
  } else {
    error = { message: 'Memory not found in either database or deletion failed' };
  }
  
  return { data: deletedData, error };
}

// Get database health status
export async function getDatabaseStatus() {
  const [healthA, healthB] = await Promise.all([
    testDatabaseConnection(dbA),
    testDatabaseConnection(dbB)
  ]);
  
  return {
    databaseA: healthA,
    databaseB: healthB,
    bothHealthy: healthA && healthB,
    anyHealthy: healthA || healthB
  };
}

// Fetch single memory by ID from both databases
export async function fetchMemoryById(id: string) {
  const fetchPromises = [
    dbA.client.from('memories').select('*').eq('id', id).single(),
    dbB.client.from('memories').select('*').eq('id', id).single()
  ];
  
  const [resultA, resultB] = await Promise.allSettled(fetchPromises);
  
  // Return the first successful result
  if (resultA.status === 'fulfilled' && !resultA.value.error) {
    return { data: cleanMemoryData(resultA.value.data), error: null };
  } else if (resultB.status === 'fulfilled' && !resultB.value.error) {
    return { data: cleanMemoryData(resultB.value.data), error: null };
  } else {
    return { data: null, error: { message: 'Memory not found in either database' } };
  }
}

// Export individual database clients for non-memory operations
export const primaryDB = dbA.client; // For banned_users, announcements, etc.
export const secondaryDB = dbB.client; // Backup reference
