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

// Round-robin state (using persistent storage mechanism)
let currentDatabase = 'A';

// Function to get next database for round-robin
function getNextDatabase(): 'A' | 'B' {
  currentDatabase = currentDatabase === 'A' ? 'B' : 'A';
  return currentDatabase;
}

// Interface for memory data
interface MemoryData {
  id?: string;
  recipient: string;
  message: string;
  sender?: string | null;
  status: string;
  color: string;
  full_bg: boolean;
  animation?: string | null;
  ip?: string | null;
  country?: string | null;
  uuid?: string | null;
  tag?: string | null;
  sub_tag?: string | null;
  created_at?: string;
  pinned?: boolean;
  pinned_until?: string | null;
  [key: string]: string | boolean | null | undefined;
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

// Insert memory with round-robin and failover
export async function insertMemory(memoryData: MemoryData) {
  const primaryDB = getNextDatabase();
  const secondaryDB = primaryDB === 'A' ? 'B' : 'A';
  
  const primaryClient = primaryDB === 'A' ? dbA : dbB;
  const secondaryClient = secondaryDB === 'A' ? dbA : dbB;
  
  console.log(`Attempting to write to database ${primaryDB} first`);
  
  // Try primary database first
  try {
    const { data, error } = await primaryClient.client
      .from('memories')
      .insert([memoryData])
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
        .insert([memoryData])
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
    memoriesA = resultA.value.data || [];
  } else {
    console.error('Error fetching from database A:', resultA.status === 'fulfilled' ? resultA.value.error : resultA.reason);
  }
  
  if (resultB.status === 'fulfilled' && !resultB.value.error) {
    memoriesB = resultB.value.data || [];
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
  
  // Apply ordering
  if (orderBy.created_at) {
    filteredMemories.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return orderBy.created_at === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }
  
  // Apply pinned ordering (pinned items first)
  if (orderBy.pinned) {
    filteredMemories.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }
  
  return { data: filteredMemories, error: null };
}

// Count memories from both databases
export async function countMemories(filters: Record<string, string> = {}) {
  const { data } = await fetchMemories(filters);
  return { count: data.length, error: null };
}

// Update memory in both databases (finds the record first)
export async function updateMemory(id: string, updates: Partial<MemoryData>) {
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
    return { data: resultA.value.data, error: null };
  } else if (resultB.status === 'fulfilled' && !resultB.value.error) {
    return { data: resultB.value.data, error: null };
  } else {
    return { data: null, error: { message: 'Memory not found in either database' } };
  }
}

// Export individual database clients for non-memory operations
export const primaryDB = dbA.client; // For banned_users, announcements, etc.
export const secondaryDB = dbB.client; // Backup reference
