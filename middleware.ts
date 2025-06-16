import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  const host = request.headers.get('host') || ''

  // Skip middleware for sitemap.xml
  if (path === '/sitemap.xml') {
    return NextResponse.next()
  }

  // Handle trailing slashes
  if (path !== '/' && path.endsWith('/')) {
    return NextResponse.redirect(
      new URL(path.slice(0, -1), request.url),
      { status: 301 }
    )
  }

  // Handle HTTP to HTTPS redirect
  if (request.headers.get('x-forwarded-proto') === 'http') {
    return NextResponse.redirect(
      new URL(request.nextUrl.pathname, `https://${host}`),
      { status: 301 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 