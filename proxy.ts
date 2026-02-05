import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addSecurityHeaders } from './lib/securityHeaders';

let maintenanceCache: { checkedAt: number; isActive: boolean } | null = null;
const MAINTENANCE_TTL_MS = 30_000;

async function getMaintenanceStatus(): Promise<boolean> {
  const now = Date.now();
  if (maintenanceCache && (now - maintenanceCache.checkedAt) < MAINTENANCE_TTL_MS) {
    return maintenanceCache.isActive;
  }

  try {
    const maintenanceResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/maintenance?id=eq.1&select=is_active`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    if (maintenanceResponse.ok) {
      const data = await maintenanceResponse.json();
      const isActive = !!(data && data.length > 0 && data[0].is_active);
      maintenanceCache = { checkedAt: now, isActive };
      return isActive;
    }
  } catch (error) {
    console.error('Error checking maintenance status:', error);
  }

  maintenanceCache = { checkedAt: now, isActive: false };
  return false;
}

export async function proxy(request: NextRequest) {
  // Skip maintenance check for admin and maintenance pages
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/maintenance')) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // Skip maintenance check for localhost/development
  const hostname = request.nextUrl.hostname;
  const isLocalhost = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     hostname === '0.0.0.0' ||
                     hostname.startsWith('localhost:') ||
                     hostname.endsWith('.local');
  
  if (isLocalhost) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  try {
    const isMaintenanceActive = await getMaintenanceStatus();
    if (isMaintenanceActive) {
      const redirectResponse = NextResponse.redirect(new URL('/maintenance', request.url));
      return addSecurityHeaders(redirectResponse);
    }
  } catch (error) {
    console.error('Error checking maintenance status:', error);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - maintenance (maintenance page)
     * - admin (admin panel)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|maintenance|admin).*)',
  ],
}; 