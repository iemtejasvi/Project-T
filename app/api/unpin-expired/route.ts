import { NextRequest } from 'next/server';
import { unpinExpiredMemories } from '@/lib/dualMemoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    const rateLimitKey = generateRateLimitKey(ip, null, 'unpin-expired');
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down.',
        429,
        { origin, details: { retryAfter: rateLimit.retryAfter } }
      );
    }

    const count = await unpinExpiredMemories();
    return createSecureResponse({ success: true, count }, 200, { origin });
  } catch (error) {
    console.error('Unpin expired error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
