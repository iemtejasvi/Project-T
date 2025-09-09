// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Global singleton pattern to prevent multiple instances across all imports
if (!global.__supabaseClient) {
  global.__supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = global.__supabaseClient;
