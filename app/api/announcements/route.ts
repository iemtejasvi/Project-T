import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { unstable_cache } from 'next/cache';

// ISR: cache active announcement for 30s so thousands of visitors share one DB call.
const getCachedAnnouncement = unstable_cache(
  async () => {
    const { data, error } = await primaryDB
      .from('announcements')
      .select('id, message, expires_at, link_url, background_color, text_color, icon, title, is_dismissible')
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Announcement fetch error:', error.message);
      return null;
    }
    return data;
  },
  ['active-announcement'],
  { revalidate: 30, tags: ['announcements'] }
);

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') || 'anonymous';
    const rateLimitKey = generateRateLimitKey(ip, null, 'announcements');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);
    if (!rateLimit.allowed) {
      return createSecureErrorResponse('Too many requests.', 429, {
        origin, details: { retryAfter: rateLimit.retryAfter },
      });
    }

    const data = await getCachedAnnouncement();

    // Check expiry at request time (cache returns raw data)
    if (data?.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
      return createSecureResponse({ data: null }, 200, { origin });
    }

    return createSecureResponse({ data }, 200, { origin });
  } catch (error) {
    console.error('Announcement API error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
