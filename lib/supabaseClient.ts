import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL2) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL2");
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY2) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY2");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseUrl2 = process.env.NEXT_PUBLIC_SUPABASE_URL2;
const supabaseAnonKey2 = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY2;

// First Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Second Supabase instance
export const supabase2 = createClient(supabaseUrl2, supabaseAnonKey2);

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
    // Create query builders for both databases
    let query1 = supabase.from("memories").select("*");
    let query2 = supabase2.from("memories").select("*");

    // Apply filters if they exist
    if (params.status) {
      query1 = query1.eq("status", params.status);
      query2 = query2.eq("status", params.status);
    }
    if (params.pinned !== undefined) {
      query1 = query1.eq("pinned", params.pinned);
      query2 = query2.eq("pinned", params.pinned);
    }

    // Execute queries
    const [result1, result2] = await Promise.all([
      query1.order("created_at", { ascending: false }),
      query2.order("created_at", { ascending: false }),
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
    // Create query builders for both databases
    let query1 = supabase.from("memories").select("*", { count: "exact", head: true });
    let query2 = supabase2.from("memories").select("*", { count: "exact", head: true });

    // Apply filters if they exist
    if (params.status) {
      query1 = query1.eq("status", params.status);
      query2 = query2.eq("status", params.status);
    }
    if (params.pinned !== undefined) {
      query1 = query1.eq("pinned", params.pinned);
      query2 = query2.eq("pinned", params.pinned);
    }

    const [count1, count2] = await Promise.all([query1, query2]);

    if (count1.error) throw count1.error;
    if (count2.error) throw count2.error;

    return (count1.count || 0) + (count2.count || 0);
  } catch (error) {
    console.error("Error getting memory count:", error);
    return 0;
  }
}

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