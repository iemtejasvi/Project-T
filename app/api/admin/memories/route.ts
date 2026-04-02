import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { sanitizeNumber } from '@/lib/inputSanitizer';
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

  const rateLimitKey = generateRateLimitKey(ip, null, 'admin-memories');
  const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

  if (!rateLimit.allowed) {
    return createSecureErrorResponse(
      'Too many requests. Please slow down.',
      429,
      { origin, details: { retryAfter: rateLimit.retryAfter } }
    );
  }

  try {
    const { searchParams } = new URL(request.url);

    const page = sanitizeNumber(searchParams.get('page'), { min: 0, max: 10000, integer: true }) ?? 0;
    const pageSize = sanitizeNumber(searchParams.get('pageSize'), { min: 1, max: 1000, integer: true }) ?? 50;

    const status = (searchParams.get('status') || '').toLowerCase();
    const pinnedParam = searchParams.get('pinned');
    const search = (searchParams.get('search') || '').slice(0, 100);

    const allowedStatuses = new Set(['pending', 'approved', 'banned', '']);
    if (!allowedStatuses.has(status)) {
      return createSecureErrorResponse('Invalid status parameter', 400, { origin });
    }

    const pinned = pinnedParam === null ? undefined : pinnedParam === 'true';

    let query = primaryDB.from('memories').select('*', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (typeof pinned === 'boolean') query = query.eq('pinned', pinned);
    if (search) {
      // Escape PostgREST special chars AND ilike wildcards to prevent pattern injection
      const safe = search.replace(/[,.()"\\':]/g, '').replace(/%/g, '\\%').replace(/_/g, '\\_');
      if (safe.length > 0) {
        query = query.or(`recipient.ilike.%${safe}%,sender.ilike.%${safe}%,message.ilike.%${safe}%`);
      }
    }

    // Admin ordering: pinned first, then newest
    query = query.order('pinned', { ascending: false });
    query = query.order('created_at', { ascending: false });

    // Apply pagination
    const start = page * pageSize;
    const endIndex = start + pageSize - 1;
    query = query.range(start, endIndex);

    const result = await query;

    if (result.error) {
      return createSecureErrorResponse(result.error.message || 'Failed to fetch memories', 500, { origin });
    }

    const totalCount = result.count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return createSecureResponse(
      { data: result.data || [], totalCount, totalPages, currentPage: page, error: null },
      200,
      { origin, cacheControl: 'no-store' }
    );
  } catch (error) {
    console.error('Admin memories API error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
