// lib/memoryDB.ts
import { createClient } from "@supabase/supabase-js";

// Database A configuration with both anon (read) and service role (write) clients
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

// Count statuses (parallel queries for speed at scale)
export async function getStatusCounts() {
  const statuses = ["pending", "approved", "banned"] as const;

  const results = await Promise.all(
    statuses.map(s =>
      dbA.client
        .from('memories')
        .select('id', { count: 'exact', head: true })
        .eq('status', s)
        .then(res => ({ status: s, count: (res as unknown as { count: number | null }).count ?? null }))
    )
  );

  const counts: Record<string, number | null> = { pending: null, approved: null, banned: null };
  for (const r of results) counts[r.status] = r.count;
  return counts;
}

// Measure database latency (ms)
export async function measureDbLatency() {
  function nowMs() {
    if (typeof performance !== 'undefined' && performance.now) return performance.now();
    return Date.now();
  }
  const t0 = nowMs();
  await dbA.client.from('memories').select('id').limit(1);
  const t1 = nowMs();
  return t1 - t0;
}

// Count expired pinned memories
export async function getExpiredPinnedCount() {
  const now = new Date().toISOString();
  const res = await dbA.client.from('memories').select('id', { count: 'exact', head: true }).eq('pinned', true).lte('pinned_until', now);
  const total = (res as unknown as { count: number | null }).count ?? 0;
  return { total };
}

// Unpin all expired pins (single bulk UPDATE — scales to millions)
export async function unpinExpiredMemories(): Promise<number> {
  const now = new Date().toISOString();
  const { data, error } = await dbA.writeClient
    .from('memories')
    .update({ pinned: false, pinned_until: null })
    .eq('pinned', true)
    .lte('pinned_until', now)
    .select('id');
  if (error) { console.error('Unpin expired error:', error); return 0; }
  return data?.length ?? 0;
}

// Scrub message content for destructed memories (single bulk UPDATE — scales to millions)
export async function scrubDestructedMemories(): Promise<number> {
  const now = new Date().toISOString();
  const { data, error } = await dbA.writeClient
    .from('memories')
    .update({ message: '' })
    .eq('status', 'approved')
    .lte('destruct_at', now)
    .neq('message', '')
    .select('id');
  if (error) { console.error('Scrub destructed error:', error); return 0; }
  return data?.length ?? 0;
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

export function isRevealableNow(memory: MemoryData): boolean {
  const revealAt = memory.reveal_at;
  if (typeof revealAt !== 'string' || revealAt.length === 0) return true;
  const revealTs = new Date(revealAt).getTime();
  if (!Number.isFinite(revealTs)) return true;
  return revealTs <= Date.now();
}

export function shouldDestructNow(memory: MemoryData): boolean {
  if (String(memory.status || '').toLowerCase() !== 'approved') return false;
  const destructAt = memory.destruct_at;
  if (typeof destructAt !== 'string' || destructAt.length === 0) return false;
  const destructTs = new Date(destructAt).getTime();
  if (!Number.isFinite(destructTs)) return false;
  return destructTs <= Date.now();
}

export function redactIfDestructed(memory: MemoryData): MemoryData {
  if (!shouldDestructNow(memory)) return memory;
  // Permanent deletion of message content: once destructed, never return the original message.
  // We keep the record so the UI can render a "destructed" placeholder card.
  if (typeof memory.message === 'string' && memory.message.length === 0) return memory;
  return { ...memory, message: '' };
}

// Redact unrevealed time capsule memories: keep the card visible but hide the message.
// reveal_at is preserved via spread so the client can compute the countdown timer.
export function redactIfUnrevealed(memory: MemoryData): MemoryData {
  if (isRevealableNow(memory)) return memory;
  // Memory is not yet revealed — redact message, keep metadata (including reveal_at)
  return {
    ...memory,
    message: '',
    is_time_capsule_locked: 'true',
  };
}

export function shouldFilterByRevealAt(filters: Record<string, string>): boolean {
  // Only public/approved views should hide unrevealed memories.
  // Admin needs to see pending/banned/other statuses even if reveal_at is in the future.
  const status = (filters.status || '').toLowerCase();
  return status === 'approved' || status === '';
}

function getHourInTimeZone(timeZone: string): number | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const hourPart = parts.find((p) => p.type === 'hour')?.value;
    if (!hourPart) return null;
    const hour = Number(hourPart);
    if (!Number.isFinite(hour)) return null;
    return hour;
  } catch {
    return null;
  }
}

export function isNightOnlyVisibleNow(memory: MemoryData): boolean {
  const nightOnly = Boolean((memory as unknown as Record<string, unknown>).night_only);
  if (!nightOnly) return true;

  const tz = String((memory as unknown as Record<string, unknown>).night_tz || '').trim();
  if (!tz) return false;

  const startHourRaw = (memory as unknown as Record<string, unknown>).night_start_hour;
  const endHourRaw = (memory as unknown as Record<string, unknown>).night_end_hour;
  const startHour = typeof startHourRaw === 'number' ? startHourRaw : Number(startHourRaw);
  const endHour = typeof endHourRaw === 'number' ? endHourRaw : Number(endHourRaw);

  const start = Number.isFinite(startHour) ? startHour : 21;
  const end = Number.isFinite(endHour) ? endHour : 6;

  const hour = getHourInTimeZone(tz);
  if (hour === null) return false;

  if (start === end) return true;
  if (start < end) {
    return hour >= start && hour < end;
  }
  return hour >= start || hour < end;
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

// Insert memory into database
export async function insertMemory(memoryData: Record<string, unknown>) {
  const cleanedData = cleanMemoryData(memoryData);
  
  try {
    const { data, error } = await dbA.writeClient
      .from('memories')
      .insert([cleanedData])
      .select()
      .single();
      
    if (!error && data) {
      console.log('Successfully wrote to database');
      return { data, error: null, database: 'A' };
    } else {
      return { data: null, error: { message: error?.message || 'Unknown error' }, database: null };
    }
  } catch (err) {
    console.error('Failed to write to database:', err);
    return { data: null, error: { message: String(err) }, database: null };
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
  let query = dbA.client.from('memories').select('*', { count: 'exact' });

  // Filter out unrevealed time capsule memories at DB level for public views.
  // Cards simply don't appear until reveal_at passes.
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
  
  // Search by recipient or sender name
  if (searchTerm) {
    query = query.or(`recipient.ilike.%${searchTerm}%,sender.ilike.%${searchTerm}%`);
  }
  
  // Order by pinned first, then created_at
  query = query.order('pinned', { ascending: false });
  if (orderBy.created_at) {
    query = query.order('created_at', { ascending: orderBy.created_at === 'asc' });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Over-fetch buffer: post-query filters (night_only, edge-case reveal_at) can
  // remove items, causing fewer cards than requested. Fetch extra and trim after.
  const fetchBuffer = shouldFilterByRevealAt(filters) ? 6 : 0;
  const start = page * pageSize;
  const endIndex = start + pageSize + fetchBuffer - 1;
  query = query.range(start, endIndex);
  
  const result = await query;
  
  if (result.error) {
    return { data: [], totalCount: 0, totalPages: 0, currentPage: page, error: result.error };
  }

  const memories = (result.data || []).map(cleanMemoryData);
  const totalCount = result.count || 0;

  // NOTE: Night-only filtering and time capsule/destruct redaction are applied
  // AFTER caching in the API route, so cached data stays fresh for reveal_at checks.
  const allMemories = memories.slice(0, pageSize);

  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    data: allMemories,
    totalCount,
    totalPages,
    currentPage: page,
    error: null
  };
}

// Legacy fetch function - now optimized to use limits when possible
export async function fetchMemories(filters: Record<string, string> = {}, orderBy: Record<string, string> = {}) {
  const limit = 1000; // Reasonable limit to prevent loading millions of records
  
  let query = dbA.client.from('memories').select('*');

  // NOTE: No longer filtering out unrevealed time capsules at DB level.
  // They are included but redacted server-side so cards show blurred.
  
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
  
  const result = await query;
  
  let allMemories: MemoryData[] = [];
  
  if (!result.error) {
    allMemories = (result.data || []).map(cleanMemoryData);
  } else {
    console.error('Error fetching from database:', result.error);
  }
  
  // Apply night-only filter, then redact unrevealed time capsules and destructed messages
  const nightFiltered = shouldFilterByRevealAt(filters) ? allMemories.filter(isNightOnlyVisibleNow) : allMemories;
  let filteredMemories = nightFiltered.map(redactIfUnrevealed).map(redactIfDestructed);
  
  // Apply in-memory filters (redundant safety — already applied at DB level)
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
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    if (orderBy.created_at) {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return orderBy.created_at === 'desc' ? dateB - dateA : dateA - dateB;
    }
    
    return 0;
  });

  return { data: filteredMemories, error: null };
}

// Count memories (efficient server-side count)
export async function countMemories(filters: Record<string, string> = {}) {
  try {
    let query = dbA.client.from('memories').select('id', { count: 'exact', head: true });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.id) query = query.eq('id', filters.id);
    if (filters.ip) query = query.eq('ip', filters.ip);
    if (filters.uuid) query = query.eq('uuid', filters.uuid);
    if (filters.pinned !== undefined) {
      query = query.eq('pinned', filters.pinned === 'true');
    }

    const res = await query;
    const count = (res as unknown as { count: number | null }).count ?? 0;
    return { count, error: null };
  } catch (err) {
    console.error('Error counting memories:', err);
    return { count: 0, error: err };
  }
}

// Get database count
export async function getDatabaseCounts() {
  try {
    const res = await dbA.client.from('memories').select('id', { count: 'exact', head: true });
    const count = (res as unknown as { count: number | null }).count ?? null;
    return { count, error: null };
  } catch (err) {
    console.error('Error getting database count:', err);
    return { count: null, error: err };
  }
}

// Fetch recent memories ordered by created_at desc
export async function fetchRecentMemories(limit = 10): Promise<Array<{ id: string; created_at: string }>> {
  try {
    const res = await dbA.client
      .from('memories')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    type Row = { id: string; created_at: string | null };
    return ((res.data || []) as Row[])
      .filter((m): m is { id: string; created_at: string } => typeof m.created_at === 'string' && m.created_at.length > 0);
  } catch (err) {
    console.error('Error fetching recent memories:', err);
    return [];
  }
}

// Update memory
export async function updateMemory(id: string, updates: Partial<Omit<MemoryData, 'id'>>) {
  try {
    const { data, error } = await dbA.writeClient
      .from('memories')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error || !data || data.length === 0) {
      return { data: null, error: { message: error?.message || 'Memory not found or update failed' } };
    }
    
    return { data: data[0], error: null };
  } catch (err) {
    console.error('Update memory error:', err);
    return { data: null, error: { message: String(err) } };
  }
}

// Delete memory
export async function deleteMemory(id: string) {
  try {
    const { data, error } = await dbA.writeClient
      .from('memories')
      .delete()
      .eq('id', id)
      .select();
    
    if (error || !data || data.length === 0) {
      return { data: null, error: { message: error?.message || 'Memory not found or deletion failed' } };
    }
    
    return { data: data[0], error: null };
  } catch (err) {
    console.error('Delete memory error:', err);
    return { data: null, error: { message: String(err) } };
  }
}

// Get database health status
export async function getDatabaseStatus() {
  const healthy = await testDatabaseConnection(dbA);
  
  return {
    databaseA: healthy,
    healthy
  };
}

// Fetch single memory by ID
export async function fetchMemoryById(id: string) {
  try {
    const { data, error } = await dbA.client
      .from('memories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return { data: null, error: { message: 'Memory not found' } };
    }

    const raw = cleanMemoryData(data);

    // Public safety: only allow viewing approved memories.
    if (String(raw.status || '').toLowerCase() !== 'approved') {
      return { data: null, error: { message: 'Memory not found' } };
    }

    // NOTE: Night-only filtering and time capsule/destruct redaction are applied
    // AFTER caching in the API route, so reveal_at checks always use current time.
    return { data: raw, error: null };
  } catch (err) {
    console.error('Fetch memory by ID error:', err);
    return { data: null, error: { message: String(err) } };
  }
}

// Export database clients for non-memory operations
// SECURITY: Only export writeClient for SERVER-SIDE use (API routes)
// NEVER import these in client-side components (pages, layouts, etc)
export const primaryDB = dbA.writeClient; // For banned_users, announcements, maintenance, etc.

// Export read-only client
export const primaryDBRead = dbA.client;
