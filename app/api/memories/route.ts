import { NextRequest } from 'next/server';
import { fetchMemoriesPaginated } from '@/lib/dualMemoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { sanitizeNumber } from '@/lib/inputSanitizer';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

export const runtime = 'edge'; // Use edge runtime for better performance

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'anonymous';
    const rateLimitKey = generateRateLimitKey(ip, null);
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.READ_MEMORIES);
    
    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down.',
        429,
        { origin, details: { retryAfter: rateLimit.retryAfter } }
      );
    }
    
    const { searchParams } = new URL(request.url);
    
    // Parse and sanitize query parameters
    const page = sanitizeNumber(searchParams.get('page'), { min: 0, max: 10000, integer: true }) ?? 0;
    const pageSize = sanitizeNumber(searchParams.get('pageSize'), { min: 1, max: 100, integer: true }) ?? 10;
    const searchTerm = searchParams.get('search')?.slice(0, 100) || '';
    const status = searchParams.get('status') || 'approved';
    
    // Validate status parameter
    if (!['approved', 'pending', 'banned', 'all'].includes(status)) {
      return createSecureErrorResponse('Invalid status parameter', 400, { origin });
    }
    
    // Build filters
    const filters: Record<string, string> = {};
    if (status) filters.status = status;
    
    // Fetch memories
    const result = await fetchMemoriesPaginated(
      page,
      pageSize,
      filters,
      searchTerm,
      { created_at: 'desc' }
    );
    
    if (result.error) {
      return createSecureErrorResponse('Failed to fetch memories', 500, { origin });
    }
    
    // Return with secure headers and cache control
    return createSecureResponse(result, 200, {
      origin,
      cacheControl: 'public, s-maxage=10, stale-while-revalidate=30',
      additionalHeaders: {
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=60',
      }
    });
  } catch (error) {
    console.error('Error in memories API:', error);
    return createSecureErrorResponse('Internal server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
