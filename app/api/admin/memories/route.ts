import { NextRequest } from 'next/server';
import { primaryDB, secondaryDB } from '@/lib/dualMemoryDB';
import { sanitizeNumber } from '@/lib/inputSanitizer';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';

type AdminMemoryRow = Record<string, unknown> & {
  id?: string;
  status?: string | null;
  pinned?: boolean | null;
  created_at?: string | null;
};

function statusRank(status: string): number {
  const s = status.toLowerCase();
  if (s === 'banned') return 3;
  if (s === 'approved') return 2;
  if (s === 'pending') return 1;
  return 0;
}

function pickBetterRow(a: AdminMemoryRow, b: AdminMemoryRow): AdminMemoryRow {
  const ar = statusRank(String(a.status || ''));
  const br = statusRank(String(b.status || ''));
  if (ar !== br) return ar > br ? a : b;
  const ap = Boolean(a.pinned);
  const bp = Boolean(b.pinned);
  if (ap !== bp) return ap ? a : b;
  const at = new Date(String(a.created_at || '')).getTime();
  const bt = new Date(String(b.created_at || '')).getTime();
  if (Number.isFinite(at) && Number.isFinite(bt) && at !== bt) return at > bt ? a : b;
  const am = String((a as Record<string, unknown>).message || '');
  const bm = String((b as Record<string, unknown>).message || '');
  if (am.length !== bm.length) return am.length > bm.length ? a : b;
  return a;
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const rateLimitKey = generateRateLimitKey(ip, null, 'admin-memories');
  const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.GENERAL);

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
    const pageSize = sanitizeNumber(searchParams.get('pageSize'), { min: 1, max: 200, integer: true }) ?? 50;

    const status = (searchParams.get('status') || '').toLowerCase();
    const pinnedParam = searchParams.get('pinned');
    const search = (searchParams.get('search') || '').slice(0, 100);

    const allowedStatuses = new Set(['pending', 'approved', 'banned', '']);
    if (!allowedStatuses.has(status)) {
      return createSecureErrorResponse('Invalid status parameter', 400, { origin });
    }

    const pinned = pinnedParam === null ? undefined : pinnedParam === 'true';

    function buildQuery(client: typeof primaryDB) {
      let query = client.from('memories').select('*', { count: 'exact' });

      if (status) query = query.eq('status', status);
      if (typeof pinned === 'boolean') query = query.eq('pinned', pinned);
      if (search) query = query.ilike('recipient', `%${search}%`);

      // Admin ordering: pinned first, then newest
      query = query.order('pinned', { ascending: false });
      query = query.order('created_at', { ascending: false });

      // Fetch enough rows to merge-sort and slice consistently
      const endIndex = (page + 1) * pageSize - 1;
      query = query.range(0, Math.max(0, endIndex));

      return query;
    }

    const [resultA, resultB] = await Promise.allSettled([
      buildQuery(primaryDB),
      buildQuery(secondaryDB),
    ]);

    let memoriesA: Array<AdminMemoryRow> = [];
    let memoriesB: Array<AdminMemoryRow> = [];
    let countA = 0;
    let countB = 0;

    if (resultA.status === 'fulfilled' && !resultA.value.error) {
      memoriesA = (resultA.value.data || []) as Array<AdminMemoryRow>;
      countA = resultA.value.count || 0;
    }

    if (resultB.status === 'fulfilled' && !resultB.value.error) {
      memoriesB = (resultB.value.data || []) as Array<AdminMemoryRow>;
      countB = resultB.value.count || 0;
    }

    const combined = [...memoriesA, ...memoriesB];
    const idList = combined.map((m) => String(m.id || '')).filter(Boolean);
    const uniqueIds = Array.from(new Set(idList));

    let authoritativeStatusById: Map<string, string> | null = null;
    if (status && uniqueIds.length > 0) {
      const [sa, sb] = await Promise.allSettled([
        primaryDB.from('memories').select('id,status').in('id', uniqueIds),
        secondaryDB.from('memories').select('id,status').in('id', uniqueIds),
      ]);

      authoritativeStatusById = new Map();
      const applyRows = (rows: Array<{ id: string; status: string | null }> | null) => {
        if (!rows) return;
        for (const r of rows) {
          const id = String(r.id);
          const next = String(r.status || '').toLowerCase();
          const prev = authoritativeStatusById!.get(id);
          if (!prev || statusRank(next) > statusRank(prev)) {
            authoritativeStatusById!.set(id, next);
          }
        }
      };

      if (sa.status === 'fulfilled' && !sa.value.error) applyRows((sa.value.data || []) as Array<{ id: string; status: string | null }>);
      if (sb.status === 'fulfilled' && !sb.value.error) applyRows((sb.value.data || []) as Array<{ id: string; status: string | null }>);
    }

    const byId = new Map<string, AdminMemoryRow>();
    for (const row of combined) {
      const id = String(row.id || '');
      if (!id) continue;
      const currentStatus = String(row.status || '').toLowerCase();
      if (authoritativeStatusById) {
        const auth = authoritativeStatusById.get(id);
        if (auth && auth !== currentStatus) {
          continue;
        }
      }
      const existing = byId.get(id);
      if (!existing) {
        byId.set(id, row);
      } else {
        byId.set(id, pickBetterRow(existing, row));
      }
    }

    const deduped = Array.from(byId.values());
    deduped.sort((a, b) => {
      const ap = Boolean(a.pinned);
      const bp = Boolean(b.pinned);
      if (ap && !bp) return -1;
      if (!ap && bp) return 1;
      const at = new Date(String(a.created_at || '')).getTime();
      const bt = new Date(String(b.created_at || '')).getTime();
      return bt - at;
    });

    const start = page * pageSize;
    const paginated = deduped.slice(start, start + pageSize);

    const totalCount = countA + countB;
    const totalPages = Math.ceil(totalCount / pageSize);

    return createSecureResponse(
      { data: paginated, totalCount, totalPages, currentPage: page, error: null },
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
