import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { isLinkableName } from '@/lib/nameUtils';
import { unstable_cache } from 'next/cache';

// Cache for 1 hour — popular names don't change frequently
const getPopularNames = unstable_cache(
  async () => {
    const nowIso = new Date().toISOString();
    const { data } = await supabaseServer
      .from('memories')
      .select('recipient')
      .eq('status', 'approved')
      .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
      .limit(2000);

    if (!data) return [];

    // Count occurrences
    const counts = new Map<string, { count: number; display: string }>();
    for (const row of data) {
      if (!row.recipient) continue;
      const key = row.recipient.toLowerCase().trim();
      if (!isLinkableName(key)) continue;
      const existing = counts.get(key);
      if (existing) {
        existing.count++;
      } else {
        const display = key.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        counts.set(key, { count: 1, display });
      }
    }

    // Sort by count descending, take top 20 with at least 2 messages
    return Array.from(counts.entries())
      .filter(([, v]) => v.count >= 2)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .map(([key, v]) => ({ slug: key, display: v.display }));
  },
  ['popular-names-api'],
  { revalidate: 3600, tags: ['memories-feed'] }
);

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'anonymous';
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
      { origin, cacheControl: 'public, s-maxage=3600, stale-while-revalidate=7200' }
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
