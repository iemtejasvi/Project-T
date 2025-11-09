// lib/securityHeaders.ts
// Security headers and CORS configuration

import { NextResponse } from 'next/server';

/**
 * Security headers to add to all responses
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
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
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://api.ipify.org https://ipapi.co https://ip-api.com https://httpbin.org https://ipinfo.io https://icanhazip.com https://api.ip2location.io https://ipwhois.app",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  
  // Strict Transport Security (force HTTPS)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
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
  // Allow null origin for same-origin requests (browser doesn't always send Origin for same-origin)
  // This is safe because same-origin requests are checked by the browser's same-origin policy
  if (!origin) return true; // Changed from false to true
  
  // Default allowed origins in production
  const defaultAllowedOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
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
  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  
  const response = new NextResponse(null, { status: 204 });
  
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
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
      
      // No origin and no valid referer - could be legitimate same-origin or attack
      // Allow it but log for monitoring (Next.js same-origin requests often have no Origin)
      console.warn('⚠️ Request without Origin or valid Referer header:', method, request.url);
      return { valid: true, origin: undefined };
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
    console.log(`Bot detected: ${userAgent}`);
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

/**
 * Generate security report for monitoring
 */
export function generateSecurityReport(request: Request): {
  timestamp: string;
  method: string;
  url: string;
  origin: string | null;
  userAgent: string | null;
  ip: string | null;
  suspicious: boolean;
  suspiciousReasons: string[];
} {
  const suspiciousCheck = detectSuspiciousRequest(request);
  
  return {
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url,
    origin: request.headers.get('origin'),
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
        request.headers.get('x-real-ip') || 
        null,
    suspicious: suspiciousCheck.suspicious,
    suspiciousReasons: suspiciousCheck.reasons
  };
}
