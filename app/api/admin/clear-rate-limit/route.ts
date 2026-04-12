import { NextRequest } from 'next/server';
import { unblockIdentifier, checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { getClientIP } from '@/lib/getClientIP';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-clear-rl'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }
  
  try {
    const { identifier } = await request.json();
    
    if (!identifier) {
      return createSecureErrorResponse('Missing identifier (IP or UUID)', 400, { origin });
    }
    
    // Clear the rate limit for this identifier
    await unblockIdentifier(identifier);
    
    return createSecureResponse({ 
      success: true, 
      message: `Rate limit cleared for ${identifier}` 
    }, 200, { origin });
    
  } catch (error) {
    console.error('Clear rate limit error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
