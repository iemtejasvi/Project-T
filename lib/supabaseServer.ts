// lib/supabaseServer.ts
// Server-side Supabase client with SERVICE_ROLE_KEY
// This bypasses RLS and should ONLY be used on the server

import { createClient } from "@supabase/supabase-js";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY - This is required for server-side operations');
}

// Server-side client with SERVICE_ROLE_KEY (bypasses RLS)
// WARNING: This should NEVER be exposed to the client
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// For database B (if using dual database)
export const supabaseServerB = process.env.NEXT_PUBLIC_SUPABASE_URL_B && process.env.SUPABASE_SERVICE_ROLE_KEY_B
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL_B,
      process.env.SUPABASE_SERVICE_ROLE_KEY_B,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;
