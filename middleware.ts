import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { addSecurityHeaders } from './lib/securityHeaders';

export async function middleware(request: NextRequest) {
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
    // Check maintenance status from Supabase (always use primary database)
    const maintenanceResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/maintenance?id=eq.1&select=is_active`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    });

    if (maintenanceResponse.ok) {
      const data = await maintenanceResponse.json();
      if (data && data.length > 0 && data[0].is_active) {
        // Redirect to maintenance page
        const redirectResponse = NextResponse.redirect(new URL('/maintenance', request.url));
        return addSecurityHeaders(redirectResponse);
      }
    }
  } catch (error) {
    // If there's an error checking maintenance status, continue normally
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