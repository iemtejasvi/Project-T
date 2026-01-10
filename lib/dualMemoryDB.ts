// lib/dualMemoryDB.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Database configurations with both anon (read) and service role (write) clients
const dbA = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // Read client (anon key) - respects RLS
  client: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!),
  // Write client (service role) - bypasses RLS for server-side operations
  writeClient: createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
};

const dbB = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL_B!,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_B!,
  // Read client (anon key) - respects RLS
  client: createClient(process.env.NEXT_PUBLIC_SUPABASE_URL_B!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_B!),
  // Write client (service role) - bypasses RLS for server-side operations
  writeClient: createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL_B!,
    process.env.SUPABASE_SERVICE_ROLE_KEY_B || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_B!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
};

// Stateless round-robin selector with better distribution
let lastWriteTime = 0;
let lastDatabase: 'A' | 'B' = 'B';

function getNextDatabase(): 'A' | 'B' {
  // Use a combination of time and alternation for better distribution
  const now = Date.now();
  
  // If it's been more than 100ms since last write, use time-based distribution
  if (now - lastWriteTime > 100) {
    lastWriteTime = now;
    // Use a more complex hash to avoid clustering
    const hash = Math.floor(now / 1000) + Math.floor(Math.random() * 100);
    lastDatabase = (hash % 2 === 0) ? 'A' : 'B';
    return lastDatabase;
  }
  
  // For rapid successive writes, strictly alternate
  lastWriteTime = now;
  lastDatabase = lastDatabase === 'A' ? 'B' : 'A';
  return lastDatabase;
}

// Count statuses per DB
export async function getStatusCounts() {
  const statuses = ["pending", "approved", "banned"] as const;
  type Status = typeof statuses[number];
  type Counts = Record<Status, number | null>;

  async function countsFor(db: typeof dbA): Promise<Counts> {
    const counts: Counts = {
      pending: null,
      approved: null,
      banned: null,
    };

    for (const s of statuses) {
      const res = await db.client
        .from('memories')
        .select('id', { count: 'exact', head: true })
        .eq('status', s);
      const count = (res as unknown as { count: number | null }).count ?? null;
      counts[s] = count;
    }

    return counts;
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

// Scrub message content for destructed memories across both DBs
export async function scrubDestructedMemories(): Promise<number> {
  const now = new Date().toISOString();
  const [idsARes, idsBRes] = await Promise.all([
    dbA.client.from('memories').select('id').eq('status', 'approved').lte('destruct_at', now).neq('message', ''),
    dbB.client.from('memories').select('id').eq('status', 'approved').lte('destruct_at', now).neq('message', ''),
  ]);
  const idsA = (idsARes.data || []).map(r => r.id as string);
  const idsB = (idsBRes.data || []).map(r => r.id as string);
  const unique = Array.from(new Set([...idsA, ...idsB]));
  if (unique.length === 0) return 0;

  await Promise.all(unique.map(id => updateMemory(id, { message: '' })));
  return unique.length;
}

// Simulate n round-robin selections with improved distribution
export function simulateRoundRobin(n = 20) {
  const picks: Array<'A' | 'B'> = [];
  let tempLastDb: 'A' | 'B' = 'B';
  
  for (let i = 0; i < n; i++) {
    // Simulate strict alternation for testing
    tempLastDb = tempLastDb === 'A' ? 'B' : 'A';
    picks.push(tempLastDb);
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
  reveal_at?: string;
  destruct_at?: string;
  pinned?: boolean;
  pinned_until?: string;
  typewriter_enabled?: boolean;
  [key: string]: string | boolean | undefined;
}

function isRevealableNow(memory: MemoryData): boolean {
  const revealAt = memory.reveal_at;
  if (typeof revealAt !== 'string' || revealAt.length === 0) return true;
  const revealTs = new Date(revealAt).getTime();
  if (!Number.isFinite(revealTs)) return true;
  return revealTs <= Date.now();
}

function shouldDestructNow(memory: MemoryData): boolean {
  if (String(memory.status || '').toLowerCase() !== 'approved') return false;
  const destructAt = memory.destruct_at;
  if (typeof destructAt !== 'string' || destructAt.length === 0) return false;
  const destructTs = new Date(destructAt).getTime();
  if (!Number.isFinite(destructTs)) return false;
  return destructTs <= Date.now();
}

function redactIfDestructed(memory: MemoryData): MemoryData {
  if (!shouldDestructNow(memory)) return memory;
  // Permanent deletion of message content: once destructed, never return the original message.
  // We keep the record so the UI can render a "destructed" placeholder card.
  if (typeof memory.message === 'string' && memory.message.length === 0) return memory;
  return { ...memory, message: '' };
}

function shouldFilterByRevealAt(filters: Record<string, string>): boolean {
  // Only public/approved views should hide unrevealed memories.
  // Admin needs to see pending/banned/other statuses even if reveal_at is in the future.
  const status = (filters.status || '').toLowerCase();
  return status === 'approved' || status === '';
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

// Helper function to clean memory data (convert null to undefined) without using Object.fromEntries
function cleanMemoryData(data: Record<string, unknown>): MemoryData {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    cleaned[key] = value === null ? undefined : value;
  }

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
    const { data, error } = await primaryClient.writeClient
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
      const { data, error } = await secondaryClient.writeClient
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

// OPTIMIZED: Fetch paginated memories with server-side filtering
export async function fetchMemoriesPaginated(
  page: number = 0,
  pageSize: number = 10,
  filters: Record<string, string> = {},
  searchTerm: string = '',
  orderBy: Record<string, string> = {}
) {
  // Build query with filters and apply a pagination window per database
  function buildQuery(client: SupabaseClient) {
    let query = client.from('memories').select('*', { count: 'exact' });

    // Apply reveal filter at the DB level so pagination windows aren't filled with unrevealed rows.
    // Only for public/approved views.
    if (shouldFilterByRevealAt(filters)) {
      const nowIso = new Date().toISOString();
      query = query.or(`reveal_at.is.null,reveal_at.lte.${nowIso}`);
    }
    
    // Apply filters
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.id) query = query.eq('id', filters.id);
    if (filters.ip) query = query.eq('ip', filters.ip);
    if (filters.uuid) query = query.eq('uuid', filters.uuid);
    if (filters.pinned !== undefined) {
      query = query.eq('pinned', filters.pinned === 'true');
    }
    
    // Search by recipient name
    if (searchTerm) {
      query = query.ilike('recipient', `%${searchTerm}%`);
    }
    
    // Order by pinned first, then created_at
    query = query.order('pinned', { ascending: false });
    if (orderBy.created_at) {
      query = query.order('created_at', { ascending: orderBy.created_at === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply a range window so we only fetch what we need for the first N pages,
    // instead of loading the full table from each database.
    const endIndex = (page + 1) * pageSize - 1;
    if (endIndex >= 0) {
      query = query.range(0, endIndex);
    }
    
    return query;
  }
  
  // Fetch from both databases in parallel with pagination
  const [resultA, resultB] = await Promise.allSettled([
    buildQuery(dbA.client),
    buildQuery(dbB.client)
  ]);
  
  // Process results
  let memoriesA: MemoryData[] = [];
  let memoriesB: MemoryData[] = [];
  let countA = 0;
  let countB = 0;
  
  if (resultA.status === 'fulfilled' && !resultA.value.error) {
    memoriesA = (resultA.value.data || []).map(cleanMemoryData);
    countA = resultA.value.count || 0;
  }
  
  if (resultB.status === 'fulfilled' && !resultB.value.error) {
    memoriesB = (resultB.value.data || []).map(cleanMemoryData);
    countB = resultB.value.count || 0;
  }
  
  // Combine and sort
  const combined = [...memoriesA, ...memoriesB];
  const allMemoriesUnredacted = shouldFilterByRevealAt(filters) ? combined.filter(isRevealableNow) : combined;
  const allMemories = allMemoriesUnredacted.map(redactIfDestructed);
  allMemories.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    const dateA = new Date(a.created_at || '').getTime();
    const dateB = new Date(b.created_at || '').getTime();
    return orderBy.created_at === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  // Apply pagination
  const start = page * pageSize;
  const paginatedMemories = allMemories.slice(start, start + pageSize);
  const totalCount = countA + countB;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    data: paginatedMemories,
    totalCount,
    totalPages,
    currentPage: page,
    error: null
  };
}

// Legacy fetch function - now optimized to use limits when possible
export async function fetchMemories(filters: Record<string, string> = {}, orderBy: Record<string, string> = {}) {
  // For backward compatibility, but now with query limits for better performance
  const limit = 1000; // Reasonable limit to prevent loading millions of records
  
  function buildLimitedQuery(client: SupabaseClient) {
    let query = client.from('memories').select('*');

    // Apply reveal filter at the DB level for public/approved views.
    if (shouldFilterByRevealAt(filters)) {
      const nowIso = new Date().toISOString();
      query = query.or(`reveal_at.is.null,reveal_at.lte.${nowIso}`);
    }
    
    // Apply filters at database level
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.id) query = query.eq('id', filters.id);
    if (filters.ip) query = query.eq('ip', filters.ip);
    if (filters.uuid) query = query.eq('uuid', filters.uuid);
    if (filters.pinned !== undefined) {
      query = query.eq('pinned', filters.pinned === 'true');
    }
    
    // Order and limit
    query = query.order('pinned', { ascending: false });
    query = query.order('created_at', { ascending: orderBy.created_at === 'asc' });
    query = query.limit(limit);
    
    return query;
  }
  
  const [resultA, resultB] = await Promise.allSettled([
    buildLimitedQuery(dbA.client),
    buildLimitedQuery(dbB.client)
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
  
  // Combine results
  const combined = [...memoriesA, ...memoriesB];
  const allMemoriesUnredacted = shouldFilterByRevealAt(filters) ? combined.filter(isRevealableNow) : combined;
  const allMemories = allMemoriesUnredacted.map(redactIfDestructed);
  
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
    dbA.writeClient.from('memories').update(updates).eq('id', id).select(),
    dbB.writeClient.from('memories').update(updates).eq('id', id).select()
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
    dbA.writeClient.from('memories').delete().eq('id', id).select(),
    dbB.writeClient.from('memories').delete().eq('id', id).select()
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
  const raw =
    (resultA.status === 'fulfilled' && !resultA.value.error ? cleanMemoryData(resultA.value.data) : null) ||
    (resultB.status === 'fulfilled' && !resultB.value.error ? cleanMemoryData(resultB.value.data) : null);

  if (!raw) {
    return { data: null, error: { message: 'Memory not found in either database' } };
  }

  // Public safety: only allow viewing approved, revealed memories.
  // (Admin has separate access paths.)
  if (String(raw.status || '').toLowerCase() !== 'approved') {
    return { data: null, error: { message: 'Memory not found' } };
  }
  if (!isRevealableNow(raw)) {
    return { data: null, error: { message: 'Memory not found' } };
  }

  return { data: redactIfDestructed(raw), error: null };
}

// Export individual database clients for non-memory operations
// SECURITY: Only export writeClient for SERVER-SIDE use (API routes)
// NEVER import these in client-side components (pages, layouts, etc)
export const primaryDB = dbA.writeClient; // For banned_users, announcements, maintenance, etc.
export const secondaryDB = dbB.writeClient; // Backup reference

// Export read-only clients for client-side use
export const primaryDBRead = dbA.client;
export const secondaryDBRead = dbB.client;
