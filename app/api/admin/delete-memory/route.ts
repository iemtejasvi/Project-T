import { NextRequest } from 'next/server';
import { deleteMemory } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { getClientIP } from '@/lib/getClientIP';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-delete'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }
  
  try {
    const { id } = await request.json();
    
    if (!id) {
      return createSecureErrorResponse('Missing id', 400, { origin });
    }
    
    const { data, error } = await deleteMemory(id);
    
    if (error) {
      console.error('Memory delete error:', error.message);
      return createSecureErrorResponse('Delete failed', 500, { origin });
    }
    
    revalidateTag('memories-feed', 'max');
    revalidateTag('name-data', 'max');
    revalidatePath('/api/memories');
    revalidatePath('/memories');
    revalidatePath('/');

    return createSecureResponse({ success: true, data }, 200, { origin });
    
  } catch (error) {
    console.error('Admin delete error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
