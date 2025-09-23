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
  
  return { data: filteredMemories, error: null };
}

// Count memories from both databases
export async function countMemories(filters: Record<string, string> = {}) {
  const { data } = await fetchMemories(filters);
  return { count: data.length, error: null };
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

// Types for DB health metrics
export interface LatestEntry {
  id: string;
  recipient?: string | null;
  created_at: string;
}

export interface DBMetrics {
  health: { A: boolean; B: boolean };
  counts: { A: number | null; B: number | null };
  latest: { A: LatestEntry | null; B: LatestEntry | null };
  mostRecentDestination: 'A' | 'B' | null;
  recent: Array<LatestEntry & { source: 'A' | 'B' }>;
  latencyMs: { A: number; B: number };
  last24h: { A: number; B: number };
  writeSplitPercent: { A: number; B: number };
  latestIds: { A: string[]; B: string[] };
}

// DB metrics for admin health view
export async function getDatabaseMetrics(): Promise<DBMetrics> {
  // Health checks
  const [healthA, healthB] = await Promise.all([
    testDatabaseConnection(dbA),
    testDatabaseConnection(dbB)
  ]);

  // Counts
  const [countARes, countBRes] = await Promise.allSettled([
    dbA.client.from('memories').select('id', { count: 'exact', head: true }),
    dbB.client.from('memories').select('id', { count: 'exact', head: true })
  ]);
  const countA = countARes.status === 'fulfilled' && !countARes.value.error ? (countARes.value.count || 0) : null;
  const countB = countBRes.status === 'fulfilled' && !countBRes.value.error ? (countBRes.value.count || 0) : null;

  // Measure simple read latency
  const t0A = Date.now();
  try {
    await dbA.client.from('memories').select('id', { head: true, count: 'exact' }).limit(1);
  } catch (e) {}
  const latencyA = Date.now() - t0A;

  const t0B = Date.now();
  try {
    await dbB.client.from('memories').select('id', { head: true, count: 'exact' }).limit(1);
  } catch (e) {}
  const latencyB = Date.now() - t0B;

  // Latest records and recent lists
  const [latestARes, latestBRes, recentARes, recentBRes, recent100ARes, recent100BRes] = await Promise.allSettled([
    dbA.client.from('memories').select('id, recipient, created_at').order('created_at', { ascending: false }).limit(1),
    dbB.client.from('memories').select('id, recipient, created_at').order('created_at', { ascending: false }).limit(1),
    dbA.client.from('memories').select('id, recipient, created_at').order('created_at', { ascending: false }).limit(10),
    dbB.client.from('memories').select('id, recipient, created_at').order('created_at', { ascending: false }).limit(10),
    dbA.client.from('memories').select('id, created_at').order('created_at', { ascending: false }).limit(100),
    dbB.client.from('memories').select('id, created_at').order('created_at', { ascending: false }).limit(100)
  ]);

  const latestA: LatestEntry | null = latestARes.status === 'fulfilled' && !latestARes.value.error && latestARes.value.data?.[0]
    ? latestARes.value.data[0]
    : null;
  const latestB: LatestEntry | null = latestBRes.status === 'fulfilled' && !latestBRes.value.error && latestBRes.value.data?.[0]
    ? latestBRes.value.data[0]
    : null;

  const recentA: Array<LatestEntry & { source: 'A' | 'B' }> =
    recentARes.status === 'fulfilled' && !recentARes.value.error
      ? ((recentARes.value.data || []) as LatestEntry[]).map((r) => ({ ...r, source: 'A' }))
      : [];
  const recentB: Array<LatestEntry & { source: 'A' | 'B' }> =
    recentBRes.status === 'fulfilled' && !recentBRes.value.error
      ? ((recentBRes.value.data || []) as LatestEntry[]).map((r) => ({ ...r, source: 'B' }))
      : [];
  const recentCombined: Array<LatestEntry & { source: 'A' | 'B' }> = [...recentA, ...recentB]
    .sort((a,b)=> new Date(b.created_at).getTime()-new Date(a.created_at).getTime())
    .slice(0,10);

  // Stats: last 24h counts and write split over last 100
  const now = Date.now();
  const cutoff = now - 24*60*60*1000;
  const listA100: LatestEntry[] = recent100ARes.status === 'fulfilled' && !recent100ARes.value.error ? (recent100ARes.value.data || []) : [];
  const listB100: LatestEntry[] = recent100BRes.status === 'fulfilled' && !recent100BRes.value.error ? (recent100BRes.value.data || []) : [];
  const last24hA = listA100.filter((m)=> new Date(m.created_at).getTime() >= cutoff).length;
  const last24hB = listB100.filter((m)=> new Date(m.created_at).getTime() >= cutoff).length;
  const splitTotal = listA100.length + listB100.length || 1;
  const splitA = Math.round((listA100.length / splitTotal) * 100);
  const splitB = 100 - splitA;
  const latestFiveA = listA100.slice(0,5).map((m:any)=>m.id);
  const latestFiveB = listB100.slice(0,5).map((m:any)=>m.id);

  let mostRecentDestination: 'A' | 'B' | null = null;
  if (latestA && latestB) {
    mostRecentDestination = new Date(latestA.created_at).getTime() >= new Date(latestB.created_at).getTime() ? 'A' : 'B';
  } else if (latestA) {
    mostRecentDestination = 'A';
  } else if (latestB) {
    mostRecentDestination = 'B';
  }

  return {
    health: { A: healthA, B: healthB },
    counts: { A: countA, B: countB },
    latest: { A: latestA, B: latestB },
    mostRecentDestination,
    recent: recentCombined,
    latencyMs: { A: latencyA, B: latencyB },
    last24h: { A: last24hA, B: last24hB },
    writeSplitPercent: { A: splitA, B: splitB },
    latestIds: { A: latestFiveA, B: latestFiveB }
  };
}