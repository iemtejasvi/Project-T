import { NextRequest } from 'next/server';
import {
  getDatabaseStatus,
  getDatabaseCounts,
  fetchRecentMemories,
  getStatusCounts,
  measureDbLatency,
  getExpiredPinnedCount,
} from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getClientIP } from '@/lib/getClientIP';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';

  const rateLimitKey = generateRateLimitKey(ip, null, 'admin-dbhealth');
  const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

  if (!rateLimit.allowed) {
    return createSecureErrorResponse(
      'Too many requests. Please slow down.',
      429,
      { origin, details: { retryAfter: rateLimit.retryAfter } }
    );
  }

  try {
    const [status, counts, recents, statuses, lat, exp] = await Promise.all([
      getDatabaseStatus(),
      getDatabaseCounts(),
      fetchRecentMemories(10),
      getStatusCounts(),
      measureDbLatency(),
      getExpiredPinnedCount(),
    ]);

    return createSecureResponse(
      {
        success: true,
        status,
        counts,
        recent: recents,
        statusCounts: statuses,
        latency: lat,
        expiredPinned: exp,
      },
      200,
      { origin, cacheControl: 'no-store' }
    );
  } catch (error) {
    console.error('Admin dbhealth API error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
