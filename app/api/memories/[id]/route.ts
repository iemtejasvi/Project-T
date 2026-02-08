import { NextRequest } from 'next/server';
import { fetchMemoryById } from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { sanitizeUUID } from '@/lib/inputSanitizer';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { unstable_cache } from 'next/cache';

// ISR: Cache individual memory lookups for 60s, purged on content changes
const getCachedMemoryById = unstable_cache(
  async (id: string) => fetchMemoryById(id),
  ['memory-detail'],
  { revalidate: 60, tags: ['memories-feed'] }
);

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get('origin');

  try {
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

    const { id: rawId } = await context.params;
    const id = sanitizeUUID(rawId);

    if (!id) {
      return createSecureErrorResponse('Invalid id', 400, { origin });
    }

    const result = await getCachedMemoryById(id);

    if (result.error || !result.data) {
      return createSecureErrorResponse('Memory not found', 404, { origin });
    }

    return createSecureResponse(result, 200, {
      origin,
      cacheControl: 'public, s-maxage=60, stale-while-revalidate=300'
    });
  } catch (error) {
    console.error('Error in memory by id API:', error);
    return createSecureErrorResponse('Internal server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
