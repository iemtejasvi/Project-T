import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { isLinkableName } from '@/lib/nameUtils';
import { unstable_cache } from 'next/cache';
import { getClientIP } from '@/lib/getClientIP';

// Cache for 5 hours — popular names don't change frequently
const getPopularNames = unstable_cache(
  async () => {
    const { data, error } = await primaryDB.rpc('get_popular_names');
    if (error || !data) return [];

    return (data as { slug: string; cnt: number }[])
      .filter(row => isLinkableName(row.slug))
      .map(row => ({
        slug: row.slug,
        display: row.slug.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      }));
  },
  ['popular-names-api'],
  { revalidate: 18000, tags: ['popular-names'] }
);

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const ip = getClientIP(request) || 'anonymous';
    const rateLimitKey = generateRateLimitKey(ip, null, 'read');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.READ_MEMORIES);

    if (!rateLimit.allowed) {
      return createSecureErrorResponse('Too many requests.', 429, {
        origin,
        details: { retryAfter: rateLimit.retryAfter },
      });
    }

    const names = await getPopularNames();

    return createSecureResponse(
      { data: names },
      200,
      { origin, cacheControl: 'public, s-maxage=18000, stale-while-revalidate=36000' }
    );
  } catch (error) {
    console.error('Error fetching popular names:', error);
    return createSecureErrorResponse('Internal server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
