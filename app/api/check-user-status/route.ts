import { NextRequest } from 'next/server';
import { countMemories, primaryDB } from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse, validateRequest } from '@/lib/securityHeaders';

function getClientIP(request: NextRequest): string | null {
  // Try multiple headers for IP detection
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback for when no IP headers are available
  return null;
}

function getCookieValue(request: NextRequest, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
  
  if (targetCookie) {
    return targetCookie.split('=')[1];
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  try {
    // 1. SECURITY: Validate request
    const requestValidation = validateRequest(request);
    if (!requestValidation.valid) {
      // Some browsers/extensions strip Origin/Referer for same-origin fetches.
      // This endpoint is still protected by rate limiting + server-side ban checks.
      const hasOriginOrReferer =
        (typeof origin === 'string' && origin.length > 0) ||
        (typeof referer === 'string' && referer.length > 0);
      if (hasOriginOrReferer) {
        return createSecureErrorResponse(requestValidation.error || 'Invalid request', 403, { origin });
      }
    }
    
    // 2. Get client IP and UUID
    const clientIP = getClientIP(request);
    // SECURITY: do not trust UUID provided in body; only use cookie value
    const clientUUID = getCookieValue(request, 'user_uuid');
    
    // 3. SECURITY: Rate limiting
    const rateLimitKey = generateRateLimitKey(clientIP, clientUUID, 'status');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.CHECK_STATUS);
    
    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down.',
        429,
        { origin, details: { retryAfter: rateLimit.retryAfter } }
      );
    }
    
    // Owner exemption and localhost
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || 
                       host.includes('127.0.0.1') ||
                       host.startsWith('localhost:') ||
                       clientIP === '127.0.0.1' || 
                       clientIP === '::1';
    
    // Check if IP matches owner (from environment variable)
    const ownerIP = process.env.OWNER_IP_ADDRESS;
    const isOwner = ownerIP && clientIP === ownerIP;
    
    if (isOwner || isLocalhost) {
      return createSecureResponse({
        canSubmit: true,
        isBanned: false,
        memoryCount: 0,
        isOwner: true
      }, 200, { origin });
    }

    let isBanned = false;
    let memoryCount = 0;
    let isUnlimited = false;

    // Check global override first
    const { data: settingsData } = await primaryDB
      .from('site_settings')
      .select('word_limit_disabled_until')
      .eq('id', 1)
      .single();
    const overrideUntil = settingsData?.word_limit_disabled_until ? new Date(settingsData.word_limit_disabled_until) : null;
    const now = new Date();
    const globalOverrideActive = overrideUntil ? now < overrideUntil : false;

    if (!globalOverrideActive && (clientIP || clientUUID)) {
      try {
        const banQueries = [];
        if (clientIP) banQueries.push(`ip.eq.${clientIP}`);
        if (clientUUID) banQueries.push(`uuid.eq.${clientUUID}`);

        // Run ban check, count checks, and unlimited check all in parallel
        const banPromise = banQueries.length > 0
          ? primaryDB.from('banned_users').select('id').or(banQueries.join(',')).limit(1)
          : Promise.resolve({ data: null, error: null });

        const countPromise = Promise.all([
          clientIP ? countMemories({ ip: clientIP }) : Promise.resolve({ count: 0 }),
          clientUUID ? countMemories({ uuid: clientUUID }) : Promise.resolve({ count: 0 }),
        ]);

        const unlimitedQueries: string[] = [];
        if (clientIP) unlimitedQueries.push(`ip.eq.${clientIP}`);
        if (clientUUID) unlimitedQueries.push(`uuid.eq.${clientUUID}`);
        const unlimitedPromise = unlimitedQueries.length > 0
          ? primaryDB.from('unlimited_users').select('id').or(unlimitedQueries.join(',')).limit(1)
          : Promise.resolve({ data: null });

        const [banResult, countResults, unlimitedResult] = await Promise.all([
          banPromise, countPromise, unlimitedPromise,
        ]);

        if (banResult.error) {
          console.error('Ban check error:', banResult.error);
          return createSecureErrorResponse('Server error during validation.', 500, { origin });
        }

        isBanned = !!(banResult.data && (banResult.data as unknown[]).length > 0);

        if (!isBanned) {
          const [ipResult, uuidResult] = countResults;
          memoryCount = Math.max(ipResult.count, uuidResult.count);
        }

        isUnlimited = !!(unlimitedResult.data && (unlimitedResult.data as unknown[]).length);
      } catch (error) {
        console.error('Validation error:', error);
        return createSecureErrorResponse('Server error during validation.', 500, { origin });
      }
    } else if (clientIP || clientUUID) {
      // Global override active — still check unlimited status
      const unlimitedQueries: string[] = [];
      if (clientIP) unlimitedQueries.push(`ip.eq.${clientIP}`);
      if (clientUUID) unlimitedQueries.push(`uuid.eq.${clientUUID}`);
      if (unlimitedQueries.length) {
        const { data: unData } = await primaryDB.from('unlimited_users').select('id').or(unlimitedQueries.join(',')).limit(1);
        isUnlimited = !!(unData && unData.length);
      }
    }

    const canSubmit = !isBanned && (isUnlimited || globalOverrideActive || memoryCount < 6);

    return createSecureResponse({
      canSubmit,
      isBanned,
      memoryCount,
      hasReachedLimit: isUnlimited || globalOverrideActive ? false : memoryCount >= 6,
      isOwner: false,
      isUnlimited,
      globalOverrideActive
    }, 200, { origin });
  } catch (error) {
    console.error('Unexpected server error:', error);
    return createSecureErrorResponse(
      'An unexpected server error occurred.',
      500,
      { origin }
    );
  }
}

// Handle other HTTP methods
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureErrorResponse(
    'Method not allowed. Use POST to check user status.',
    405,
    { origin }
  );
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
