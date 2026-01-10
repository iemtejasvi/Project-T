import { NextRequest } from 'next/server';
import { fetchMemoryById } from '@/lib/dualMemoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { sanitizeUUID } from '@/lib/inputSanitizer';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

export const runtime = 'edge';

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

    const result = await fetchMemoryById(id);

    if (result.error || !result.data) {
      return createSecureErrorResponse('Memory not found', 404, { origin });
    }

    return createSecureResponse(result, 200, {
      origin,
      cacheControl: 'public, s-maxage=30, stale-while-revalidate=60',
      additionalHeaders: {
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=60',
      }
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
