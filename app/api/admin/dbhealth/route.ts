import { NextRequest } from 'next/server';
import {
  getDatabaseStatus,
  getDatabaseCounts,
  fetchRecentMemories,
  locateMemory,
  getStatusCounts,
  measureDbLatency,
  getExpiredPinnedCount,
  simulateRoundRobin,
  primaryDB,
  secondaryDB,
} from '@/lib/dualMemoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const rateLimitKey = generateRateLimitKey(ip, null, 'admin-dbhealth');
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

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

    const enriched = await Promise.all(
      (recents || []).map(async (m) => {
        const loc = await locateMemory(m.id);
        return { ...m, location: loc };
      })
    );

    const [a50, b50] = await Promise.all([
      primaryDB.from('memories').select('id, created_at').order('created_at', { ascending: false }).limit(50),
      secondaryDB.from('memories').select('id, created_at').order('created_at', { ascending: false }).limit(50),
    ]);

    const setA = new Set(((a50.data || []) as Array<{ id: string }>).map((r) => r.id));
    const setB = new Set(((b50.data || []) as Array<{ id: string }>).map((r) => r.id));

    const onlyA = Array.from(setA).filter((id) => !setB.has(id));
    const onlyB = Array.from(setB).filter((id) => !setA.has(id));
    const both = Array.from(setA).filter((id) => setB.has(id));

    const rr = simulateRoundRobin(50);

    return createSecureResponse(
      {
        success: true,
        status,
        counts,
        recent: enriched,
        statusCounts: statuses,
        latency: lat,
        expiredPinned: exp,
        diffIds: { onlyA, onlyB, both },
        rrSim: { A: rr.A, B: rr.B, picks: rr.picks },
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
