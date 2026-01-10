import { NextRequest } from 'next/server';
import { scrubDestructedMemories } from '@/lib/dualMemoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

function isAuthorizedCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (secret && secret.length > 0) {
    const url = new URL(request.url);
    const provided = url.searchParams.get('secret');
    if (provided && provided === secret) return true;

    const auth = request.headers.get('authorization');
    if (auth && auth === `Bearer ${secret}`) return true;

    return false;
  }

  // Fallback for environments without a secret configured.
  // Vercel Cron includes this header; still rate-limited.
  return request.headers.get('x-vercel-cron') === '1';
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAuthorizedCronRequest(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    const rateLimitKey = generateRateLimitKey(ip, null, 'cron-scrub-destructed');
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down.',
        429,
        { origin, details: { retryAfter: rateLimit.retryAfter } }
      );
    }

    const scrubbed = await scrubDestructedMemories();
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
