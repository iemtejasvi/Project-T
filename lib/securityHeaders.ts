// lib/securityHeaders.ts
// Security headers and CORS configuration
// NOTE: Canonical security headers (CSP, HSTS, etc.) are now applied globally
// via next.config.js headers() for ALL routes (pages + API). The headers below
// are kept for API route programmatic responses. Keep CSP in sync with next.config.js.

import { NextResponse } from 'next/server';

/**
 * Security headers to add to all responses
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'SAMEORIGIN',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable XSS filter in browsers
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy (restrict browser features)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // Content Security Policy (CSP)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://*.adtrafficquality.google https://challenges.cloudflare.com https://static.cloudflareinsights.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://challenges.cloudflare.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.ipify.org https://ipapi.co https://ip-api.com https://httpbin.org https://ipinfo.io https://icanhazip.com https://api.ip2location.io https://ipwhois.app https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://*.adtrafficquality.google https://static.cloudflareinsights.com",
    "frame-src 'self' https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://challenges.cloudflare.com https://*.adtrafficquality.google https://www.google.com",
    "frame-ancestors 'self' https://admin.google.com https://ogs.google.com https://*.google.com",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Strict Transport Security (force HTTPS)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Cross-Origin-Opener-Policy for better isolation
  'Cross-Origin-Opener-Policy': 'same-origin'
} as const;

/**
 * CORS configuration
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Max-Age': '86400', // 24 hours
} as const;

/**
 * Check if origin is allowed (whitelist approach)
 * Note: Same-origin requests may not include Origin header, so we allow null for GET requests
 */
export function isOriginAllowed(origin: string | null, allowedOrigins?: string[]): boolean {
  // SECURITY: Reject null/missing origin on explicit checks.
  // Same-origin GET requests may lack Origin — callers should handle that case separately.
  if (!origin) return false;
  
  // Default allowed origins in production
  const defaultAllowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    // Hardcoded production domain as fallback in case env var is missing
    'https://www.ifonlyisentthis.com',
    'https://ifonlyisentthis.com',
  ].filter(Boolean) as string[];
  
  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    defaultAllowedOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
  }
  
  const origins = allowedOrigins || defaultAllowedOrigins;
  
  return origins.some(allowed => {
    if (!allowed) return false;
    
    try {
      const originUrl = new URL(origin);
      const allowedUrl = new URL(allowed);
      
      return originUrl.origin === allowedUrl.origin;
    } catch {
      return false;
    }
  });
}

/**
 * Add security headers to a NextResponse
 */
export function addSecurityHeaders(response: NextResponse, options?: {
  includeCors?: boolean;
  allowedOrigin?: string;
  additionalHeaders?: Record<string, string>;
}): NextResponse {
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Add CORS headers if requested
  if (options?.includeCors) {
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    if (options.allowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', options.allowedOrigin);
    }
  }
  
  // Add additional headers
  if (options?.additionalHeaders) {
    Object.entries(options.additionalHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

/**
 * Create a secure API response with proper headers
 */
export function createSecureResponse(
  data: unknown,
  status: number = 200,
  options?: {
    origin?: string | null;
    additionalHeaders?: Record<string, string>;
    cacheControl?: string;
  }
): NextResponse {
  const response = NextResponse.json(data, { status });
  
  // Check if CORS should be enabled
  const includeCors = options?.origin ? isOriginAllowed(options.origin) : false;
  
  addSecurityHeaders(response, {
    includeCors,
    allowedOrigin: includeCors && options?.origin ? options.origin : undefined,
    additionalHeaders: options?.additionalHeaders
  });
  
  // Add cache control if specified
  if (options?.cacheControl) {
    response.headers.set('Cache-Control', options.cacheControl);
  }
  
  return response;
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleCorsPreFlight(origin: string | null): NextResponse {
  // For preflight, allow null origin (same-origin preflight is rare but valid)
  if (origin && !isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  const response = new NextResponse(null, { status: 204 });

  // SECURITY: Never send Access-Control-Allow-Origin: * with credentials.
  // Only reflect the actual origin if it passed validation.
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

/**
 * Create error response with security headers
 */
export function createSecureErrorResponse(
  message: string,
  status: number = 500,
  options?: {
    origin?: string | null;
    details?: Record<string, unknown>;
  }
): NextResponse {
  const errorData = {
    error: message,
    ...(options?.details || {})
  };
  
  return createSecureResponse(errorData, status, {
    origin: options?.origin,
    cacheControl: 'no-store, no-cache, must-revalidate'
  });
}

/**
 * Validate request origin and method
 * For same-origin requests, browsers may not send Origin header - use Referer as fallback
 */
export function validateRequest(request: Request): {
  valid: boolean;
  error?: string;
  origin?: string;
} {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const method = request.method;
  
  // Allow OPTIONS for CORS preflight
  if (method === 'OPTIONS') {
    return { valid: true, origin: origin || undefined };
  }
  
  // For POST, PUT, DELETE, validate origin
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    // If no origin header, check referer (for same-origin requests)
    if (!origin) {
      // Same-origin requests don't always have Origin, but should have Referer
      if (referer) {
        try {
          const refererUrl = new URL(referer);
          const requestUrl = new URL(request.url);
          
          // Check if referer is from same origin
          if (refererUrl.origin === requestUrl.origin) {
            // Same-origin request, allow it
            return { valid: true, origin: requestUrl.origin };
          }
        } catch {
          // Invalid referer URL, continue to origin check
        }
      }
      
      // No origin and no valid same-origin referer — reject.
      console.warn('⚠️ Blocked mutation without Origin or valid Referer:', method, request.url);
      return { valid: false, error: 'Origin verification failed' };
    }
    
    // If origin is present, validate it
    if (!isOriginAllowed(origin)) {
      return {
        valid: false,
        error: 'Origin not allowed',
        origin
      };
    }
  }
  
  return { valid: true, origin: origin || undefined };
}

/**
 * Check for suspicious request patterns
 */
export function detectSuspiciousRequest(request: Request): {
  suspicious: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  
  // Check user agent
  const userAgent = request.headers.get('user-agent');
  if (!userAgent || userAgent.length < 10) {
    reasons.push('Missing or invalid user agent');
  }
  
  // Check for common bot signatures
  const botSignatures = ['bot', 'crawler', 'spider', 'scraper', 'curl', 'wget'];
  if (userAgent && botSignatures.some(sig => userAgent.toLowerCase().includes(sig))) {
    // Allow legitimate bots but log them
    // Bot detected — no action needed, logged for future monitoring integration
  }
  
  // Check content-type for POST/PUT
  if (['POST', 'PUT'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      reasons.push('Invalid content-type for JSON API');
    }
  }
  
  // Check for abnormally large content-length
  const contentLength = request.headers.get('content-length');
  if (contentLength) {
    const length = parseInt(contentLength, 10);
    if (length > 1024 * 1024) { // 1MB
      reasons.push('Request body too large');
    }
  }
  
  return {
    suspicious: reasons.length > 0,
    reasons
  };
}
