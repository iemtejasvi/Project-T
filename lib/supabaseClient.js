// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Lazy initialization to prevent multiple instances
let supabaseClient = null;

export const supabase = {
  get from() {
    if (!supabaseClient) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient.from.bind(supabaseClient);
  },
  get auth() {
    if (!supabaseClient) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient.auth;
  },
  get storage() {
    if (!supabaseClient) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient.storage;
  },
  get realtime() {
    if (!supabaseClient) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient.realtime;
  }
};
