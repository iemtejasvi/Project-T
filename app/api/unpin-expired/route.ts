import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { unpinExpiredMemories } from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    // Require admin authentication or cron secret
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const isCron = (() => {
      if (!cronSecret || !authHeader) return false;
      const expected = `Bearer ${cronSecret}`;
      if (authHeader.length !== expected.length) return false;
      return timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected));
    })();

    if (!isAdminAuthenticated(request) && !isCron) {
      return createSecureErrorResponse('Unauthorized', 401, { origin });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    const rateLimitKey = generateRateLimitKey(ip, null, 'unpin-expired');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down.',
        429,
        { origin, details: { retryAfter: rateLimit.retryAfter } }
      );
    }

    const count = await unpinExpiredMemories();
    if (count > 0) {
      revalidateTag('memories-feed', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
    }
    return createSecureResponse({ success: true, unpinned: count }, 200, { origin });
  } catch (error) {
    console.error('Unpin expired error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
