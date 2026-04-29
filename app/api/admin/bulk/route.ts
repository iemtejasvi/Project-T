import { NextRequest } from 'next/server';
import { updateMemory, deleteMemoriesBatch, fetchMemoriesByIds, primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { getClientIP } from '@/lib/getClientIP';

type MemoryRow = {
  id: string;
  status?: string | null;
  created_at?: string | null;
  reveal_at?: string | null;
  destruct_at?: string | null;
  time_capsule_delay_minutes?: number | null;
  destruct_delay_minutes?: number | null;
};

function msBetween(a?: string | null, b?: string | null): number {
  const aTs = a ? new Date(a).getTime() : NaN;
  const bTs = b ? new Date(b).getTime() : NaN;
  if (!Number.isFinite(aTs) || !Number.isFinite(bTs)) return 0;
  const diff = aTs - bTs;
  return diff > 0 ? diff : 0;
}

function minutesFromMs(ms: number): number {
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.round(ms / (60 * 1000));
}

function buildApprovalUpdatesFromRow(row: MemoryRow): Record<string, unknown> {
  const updates: Record<string, unknown> = { status: 'approved' };
  if (String(row.status ?? '').toLowerCase() === 'approved') return updates;

  const revealDelayMs = msBetween(row.reveal_at, row.created_at);
  const destructDelayMs = msBetween(row.destruct_at, row.created_at);

  const hasTc = typeof row.time_capsule_delay_minutes === 'number' && row.time_capsule_delay_minutes > 0;
  const hasDestruct = typeof row.destruct_delay_minutes === 'number' && row.destruct_delay_minutes > 0;

  if (!hasTc) updates.time_capsule_delay_minutes = minutesFromMs(revealDelayMs);
  if (!hasDestruct) updates.destruct_delay_minutes = minutesFromMs(destructDelayMs);

  const now = Date.now();
  updates.reveal_at = new Date(now + revealDelayMs).toISOString();
  updates.destruct_at = destructDelayMs > 0 ? new Date(now + destructDelayMs).toISOString() : null;

  return updates;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-bulk'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const action = String(body.action || '');
    const idsRaw = body.ids;

    const ids = Array.isArray(idsRaw)
      ? idsRaw.map((v) => String(v)).filter(Boolean)
      : [];

    if (!action || ids.length === 0) {
      return createSecureErrorResponse('Missing action or ids', 400, { origin });
    }

    const uniqueIds = Array.from(new Set(ids)).slice(0, 200);

    if (action === 'approve') {
      // 1 query: fetch all rows that need approval
      const { data: rows, error: fetchErr } = await fetchMemoriesByIds(uniqueIds);
      if (fetchErr || !rows) {
        return createSecureErrorResponse('Failed to fetch memories', 500, { origin });
      }

      const rowMap = new Map(rows.map((r: MemoryRow) => [r.id, r]));

      // Group IDs that can be simple-approved (already approved or no timer recalc needed)
      // vs IDs that need per-row timer updates
      const simpleIds: string[] = [];
      const timerUpdates: { id: string; updates: Record<string, unknown> }[] = [];

      for (const id of uniqueIds) {
        const row = rowMap.get(id);
        if (!row) continue; // ID not found, skip
        const updates = buildApprovalUpdatesFromRow(row);
        // If updates only contain status (no timer recalc), batch them
        if (Object.keys(updates).length === 1) {
          simpleIds.push(id);
        } else {
          timerUpdates.push({ id, updates });
        }
      }

      let ok = 0;
      let failed = 0;

      // Batch-approve simple ones in a single query
      if (simpleIds.length > 0) {
        const { error } = await primaryDB
          .from('memories')
          .update({ status: 'approved' })
          .in('id', simpleIds);
        if (error) {
          failed += simpleIds.length;
        } else {
          ok += simpleIds.length;
        }
      }

      // Timer updates need per-row values, but run them all concurrently
      if (timerUpdates.length > 0) {
        const results = await Promise.all(
          timerUpdates.map(async ({ id, updates }) => {
            const { error } = await updateMemory(id, updates as Parameters<typeof updateMemory>[1]);
            return !error;
          })
        );
        ok += results.filter(Boolean).length;
        failed += results.filter((r) => !r).length;
      }

      revalidateTag('memories-feed', 'max');
      revalidateTag('name-data', 'max');
      revalidateTag('popular-names', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
      return createSecureResponse({ success: true, action, ok, failed }, 200, { origin });
    }

    if (action === 'delete') {
      // Single batch delete .  1 query instead of N
      const { deleted, error } = await deleteMemoriesBatch(uniqueIds);
      const ok = deleted;
      const failed = error ? uniqueIds.length : uniqueIds.length - deleted;
      revalidateTag('memories-feed', 'max');
      revalidateTag('name-data', 'max');
      revalidateTag('popular-names', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
      return createSecureResponse({ success: true, action, ok, failed }, 200, { origin });
    }

    return createSecureErrorResponse('Invalid action', 400, { origin });
  } catch (error) {
    console.error('Admin bulk action error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
