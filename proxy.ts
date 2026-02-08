import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory maintenance cache (edge runtime — one per isolate)
let maintenanceCache: { isActive: boolean; checkedAt: number } | null = null;
const MAINTENANCE_TTL_MS = 30_000; // Re-check every 30s

// Paths that must NEVER be blocked by maintenance mode
const BYPASS_PREFIXES = [
  '/maintenance',
  '/admin',
  '/api/',
  '/_next/',
  '/favicon',
  '/opengraph',
  '/robots',
  '/sitemap',
];

const BYPASS_EXTENSIONS = ['.ico', '.png', '.jpg', '.jpeg', '.svg', '.webp', '.css', '.js', '.woff', '.woff2'];

async function isMaintenanceActive(): Promise<boolean> {
  const now = Date.now();
  if (maintenanceCache && (now - maintenanceCache.checkedAt) < MAINTENANCE_TTL_MS) {
    return maintenanceCache.isActive;
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Can't check — assume NOT in maintenance so site stays accessible
      return false;
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/maintenance?id=eq.1&select=is_active`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        // Short timeout so middleware doesn't block page loads
        signal: AbortSignal.timeout(3000),
      }
    );

    if (!res.ok) {
      maintenanceCache = { isActive: false, checkedAt: now };
      return false;
    }

    const rows = await res.json();
    const active = Array.isArray(rows) && rows.length > 0 && rows[0].is_active === true;
    maintenanceCache = { isActive: active, checkedAt: now };
    return active;
  } catch {
    // On error, assume NOT in maintenance so site stays accessible
    maintenanceCache = { isActive: false, checkedAt: now };
    return false;
  }
}

function shouldBypass(pathname: string): boolean {
  // Check prefixes
  for (const prefix of BYPASS_PREFIXES) {
    if (pathname.startsWith(prefix)) return true;
  }
  // Check file extensions (static assets)
  for (const ext of BYPASS_EXTENSIONS) {
    if (pathname.endsWith(ext)) return true;
  }
  return false;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never block bypassed paths
  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  // Check maintenance mode
  const maintenance = await isMaintenanceActive();
  if (maintenance) {
    const url = request.nextUrl.clone();
    url.pathname = '/maintenance';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except static files and internal Next.js routes
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
