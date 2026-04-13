import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { getClientIP } from '@/lib/getClientIP';

function isValidISODate(v: unknown): boolean {
  if (typeof v !== 'string') return false;
  const d = new Date(v);
  return Number.isFinite(d.getTime());
}

// Get maintenance status
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  try {
    const { data, error } = await primaryDB
      .from('maintenance')
      .select('is_active, message, expected_end')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('Maintenance fetch error:', error.message);
      return createSecureErrorResponse('Failed to fetch maintenance status', 500, { origin });
    }

    return createSecureResponse({ success: true, data: data || { is_active: false, message: '' } }, 200, { origin, cacheControl: 'no-store' });
  } catch (error) {
    console.error('Maintenance fetch error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Update maintenance status
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-maintenance'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }

  try {
    const body = await request.json();
    const { id, is_active, message, expected_end } = body;
    const sanitized: Record<string, unknown> = {
      id: id ?? 1,
      is_active: typeof is_active === 'boolean' ? is_active : false,
    };

    if (message) sanitized.message = String(message).slice(0, 500);
    if (expected_end) {
      if (!isValidISODate(expected_end)) {
        return createSecureErrorResponse('Invalid expected_end date', 400, { origin });
      }
      sanitized.expected_end = new Date(String(expected_end)).toISOString();
    }

    const { error } = await primaryDB
      .from('maintenance')
      .upsert(sanitized);

    if (error) {
      console.error('Maintenance update error:', error.message);
      return createSecureErrorResponse('Failed to update maintenance', 500, { origin });
    }

    return createSecureResponse({ success: true }, 200, { origin });

  } catch (error) {
    console.error('Maintenance update error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
