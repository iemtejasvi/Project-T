import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { scrubDestructedMemories } from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { revalidatePath, revalidateTag } from 'next/cache';
import { getClientIP } from '@/lib/getClientIP';

function isAuthorizedCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length === 0) {
    console.error('CRON_SECRET not configured -- rejecting cron request');
    return false;
  }
  const auth = request.headers.get('authorization');
  if (!auth) return false;
  const expected = `Bearer ${secret}`;
  if (auth.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(auth), Buffer.from(expected));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAuthorizedCronRequest(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  try {
    const ip = getClientIP(request) || 'anonymous';

    const rateLimitKey = generateRateLimitKey(ip, null, 'cron-scrub-destructed');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down.',
        429,
        { origin, details: { retryAfter: rateLimit.retryAfter } }
      );
    }

    const scrubbed = await scrubDestructedMemories();
    if (scrubbed > 0) {
      revalidateTag('memories-feed', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
    }
    return createSecureResponse({ success: true, scrubbed }, 200, { origin });
  } catch (error) {
    console.error('Cron scrub destructed memories error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

export async function POST(request: NextRequest) {
  // Allow POST as well (some schedulers prefer POST)
  return GET(request);
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
