import { NextRequest } from 'next/server';
import { fetchMemoriesPaginated, redactIfDestructed, isNightOnlyVisibleNow } from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { sanitizeNumber } from '@/lib/inputSanitizer';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { unstable_cache } from 'next/cache';

// ISR data cache: DB hit once per 60s per unique (page, pageSize, search) combo.
// Returns RAW data — redaction is applied after caching so reveal_at checks are always fresh.
const getCachedMemories = unstable_cache(
  async (page: number, pageSize: number, searchTerm: string) => {
    const filters: Record<string, string> = { status: 'approved' };
    return fetchMemoriesPaginated(page, pageSize, filters, searchTerm, { created_at: 'desc' });
  },
  ['memories-feed'],
  { revalidate: 60, tags: ['memories-feed'] }
);

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'anonymous';
    const rateLimitKey = generateRateLimitKey(ip, null, 'read');
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
    const status = (searchParams.get('status') || 'approved').toLowerCase();
    
    // Public endpoint: only approved content is allowed.
    if (status !== 'approved') {
      return createSecureErrorResponse('Invalid status parameter', 400, { origin });
    }
    
    // Fetch from ISR cache (DB hit only once per 60s per unique param combo)
    const result = await getCachedMemories(page, pageSize, searchTerm);
    
    if (result.error) {
      return createSecureErrorResponse('Failed to fetch memories', 500, { origin });
    }

    // Apply night-only filter and destruct redaction after cache
    const liveData = (result.data as Parameters<typeof isNightOnlyVisibleNow>[0][])
      .filter(isNightOnlyVisibleNow)
      .map(redactIfDestructed);
    
    // Short CDN cache since redaction is time-sensitive
    return createSecureResponse({ ...result, data: liveData }, 200, {
      origin,
      cacheControl: 'public, s-maxage=10, stale-while-revalidate=30'
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
