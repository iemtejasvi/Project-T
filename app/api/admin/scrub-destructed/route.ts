import { NextRequest } from 'next/server';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { scrubDestructedMemories } from '@/lib/memoryDB';
import { revalidatePath, revalidateTag } from 'next/cache';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { getClientIP } from '@/lib/getClientIP';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-scrub'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }

  try {
    const scrubbed = await scrubDestructedMemories();
    if (scrubbed > 0) {
      revalidateTag('memories-feed', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
    }
    return createSecureResponse({ success: true, scrubbed }, 200, { origin });
  } catch (error) {
    console.error('Scrub destructed memories error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
