import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseUrl2 = process.env.NEXT_PUBLIC_SUPABASE_URL2!;
const supabaseAnonKey2 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY2!;

// First Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Second Supabase instance
export const supabase2 = createClient(supabaseUrl2, supabaseAnonKey2);

// Counter to track which database to use next
let dbCounter = 0;

// Function to get the next database instance for memories
export async function getNextMemoryDb() {
  try {
    const [count1, count2] = await Promise.all([
      supabase.from("memories").select("*", { count: "exact", head: true }),
      supabase2.from("memories").select("*", { count: "exact", head: true }),
    ]);

    if (count1.error) throw count1.error;
    if (count2.error) throw count2.error;

    return (count1.count || 0) <= (count2.count || 0) ? supabase : supabase2;
  } catch (error) {
    console.error("Error getting next memory db:", error);
    return supabase;
  }
}

export interface Memory {
  id: string;
  recipient: string;
  message: string;
  sender?: string;
  created_at: string;
  status: string;
  color: string;
  full_bg: boolean;
  letter_style: string;
  animation?: string;
  pinned?: boolean;
  pinned_until?: string;
}

export interface QueryParams {
  status?: string;
  pinned?: boolean;
  [key: string]: string | boolean | undefined;
}

// Function to get all memories from both databases
export async function getAllMemories(params: QueryParams = {}) {
  try {
    const [result1, result2] = await Promise.all([
      supabase
        .from("memories")
        .select("*")
        .match(params)
        .order("created_at", { ascending: false }),
      supabase2
        .from("memories")
        .select("*")
        .match(params)
        .order("created_at", { ascending: false }),
    ]);

    if (result1.error) throw result1.error;
    if (result2.error) throw result2.error;

    const allMemories = [...(result1.data || []), ...(result2.data || [])];
    return allMemories.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return [];
  }
}

// Function to get memory count from both databases
export async function getMemoryCount(params: QueryParams = {}) {
  try {
    const [count1, count2] = await Promise.all([
      supabase.from("memories").select("*", { count: "exact", head: true }).match(params),
      supabase2.from("memories").select("*", { count: "exact", head: true }).match(params),
    ]);

    if (count1.error) throw count1.error;
    if (count2.error) throw count2.error;

    return (count1.count || 0) + (count2.count || 0);
  } catch (error) {
    console.error("Error getting memory count:", error);
    return 0;
  }
} 