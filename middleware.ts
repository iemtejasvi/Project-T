import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Skip maintenance check for admin and maintenance pages
  if (request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/maintenance')) {
    return NextResponse.next();
  }

  try {
    // Check maintenance status from Supabase
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/maintenance?id=eq.1&select=is_active`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0 && data[0].is_active) {
        // Redirect to maintenance page
        return NextResponse.redirect(new URL('/maintenance', request.url));
      }
    }
  } catch (error) {
    // If there's an error checking maintenance status, continue normally
    console.error('Error checking maintenance status:', error);
  }

  return NextResponse.next();
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