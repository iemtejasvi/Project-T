import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { getClientIP } from '@/lib/getClientIP';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const ip = getClientIP(request) || 'anonymous';

    const rateLimitKey = generateRateLimitKey(ip, null, 'announcement-track');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down.',
        429,
        { origin, details: { retryAfter: rateLimit.retryAfter } }
      );
    }

    const { announcement_id, type } = await request.json();

    if (!announcement_id || !['view', 'click'].includes(type)) {
      return createSecureErrorResponse('Invalid request', 400, { origin });
    }

    const rpcName = type === 'view' ? 'increment_announcement_view' : 'increment_announcement_click';
    const { error } = await primaryDB.rpc(rpcName, { announcement_id_in: announcement_id });

    if (error) {
      console.error(`Announcement ${type} track error:`, error.message);
      return createSecureErrorResponse('Tracking failed', 500, { origin });
    }

    return createSecureResponse({ success: true }, 200, { origin });
  } catch (error) {
    console.error('Announcement track error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
