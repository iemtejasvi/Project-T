import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/dualMemoryDB';
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

  const rateLimitKey = generateRateLimitKey(ip, null, 'admin-banned-users');
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

  if (!rateLimit.allowed) {
    return createSecureErrorResponse(
      'Too many requests. Please slow down.',
      429,
      { origin, details: { retryAfter: rateLimit.retryAfter } }
    );
  }

  try {
    const { data, error } = await primaryDB
      .from('banned_users')
      .select('ip, uuid, country');

    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to fetch banned users', 500, { origin });
    }

    return createSecureResponse({ success: true, data: data || [] }, 200, { origin, cacheControl: 'no-store' });
  } catch (error) {
    console.error('Admin banned-users API error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
