import { NextRequest } from 'next/server';
import { updateMemory, deleteMemory, primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { revalidatePath, revalidateTag } from 'next/cache';

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

async function buildApprovalUpdates(id: string): Promise<Record<string, unknown>> {
  const updates: Record<string, unknown> = { status: 'approved' };
  const res = await primaryDB.from('memories')
    .select('id,status,created_at,reveal_at,destruct_at,time_capsule_delay_minutes,destruct_delay_minutes')
    .eq('id', id).maybeSingle();
  const current: MemoryRow | null = (!res.error && res.data) ? res.data as MemoryRow : null;
  if (!current || String(current.status ?? '').toLowerCase() === 'approved') return updates;

  const revealDelayMs = msBetween(current.reveal_at, current.created_at);
  const destructDelayMs = msBetween(current.destruct_at, current.created_at);

  const hasTc = typeof current.time_capsule_delay_minutes === 'number' && current.time_capsule_delay_minutes > 0;
  const hasDestruct = typeof current.destruct_delay_minutes === 'number' && current.destruct_delay_minutes > 0;

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
      const results = await Promise.all(
        uniqueIds.map(async (id) => {
          const updates = await buildApprovalUpdates(id);
          const { data, error } = await updateMemory(id, updates as Parameters<typeof updateMemory>[1]);
          return { id, ok: !error, error: error?.message || null, data: data || null };
        })
      );
      const ok = results.filter((r) => r.ok).length;
      const failed = results.length - ok;
      revalidateTag('memories-feed', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
      return createSecureResponse({ success: true, action, ok, failed, results }, 200, { origin });
    }

    if (action === 'delete') {
      const results = await Promise.all(
        uniqueIds.map(async (id) => {
          const { data, error } = await deleteMemory(id);
          return { id, ok: !error, error: error?.message || null, data: data || null };
        })
      );
      const ok = results.filter((r) => r.ok).length;
      const failed = results.length - ok;
      revalidateTag('memories-feed', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
      return createSecureResponse({ success: true, action, ok, failed, results }, 200, { origin });
    }

    return createSecureErrorResponse('Invalid action', 400, { origin });
  } catch (error) {
    console.error('Admin bulk action error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
