import { NextRequest } from 'next/server';
import { updateMemory, primaryDB } from '@/lib/memoryDB';
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

async function fetchMemoryRowById(id: string): Promise<MemoryRow | null> {
  const res = await primaryDB.from('memories').select('id,status,created_at,reveal_at,destruct_at,time_capsule_delay_minutes,destruct_delay_minutes').eq('id', id).maybeSingle();
  if (!res.error && res.data) return res.data as MemoryRow;
  return null;
}

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

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const { id, updates } = await request.json();
    
    if (!id || !updates || typeof updates !== 'object') {
      return createSecureErrorResponse('Missing id or updates', 400, { origin });
    }

    // If transitioning to approved, start timers from approval time.
    const nextStatus = String((updates as Record<string, unknown>).status ?? '').toLowerCase();
    if (nextStatus === 'approved') {
      const current = await fetchMemoryRowById(id);
      const currentStatus = String(current?.status ?? '').toLowerCase();

      if (current && currentStatus !== 'approved') {
        const revealDelayMs = msBetween(current.reveal_at, current.created_at);
        const destructDelayMs = msBetween(current.destruct_at, current.created_at);

        const existingTc = (current as unknown as Record<string, unknown>).time_capsule_delay_minutes;
        const existingDestruct = (current as unknown as Record<string, unknown>).destruct_delay_minutes;

        const hasTc = typeof existingTc === 'number' && Number.isFinite(existingTc) && existingTc > 0;
        const hasDestruct = typeof existingDestruct === 'number' && Number.isFinite(existingDestruct) && existingDestruct > 0;

        if (!hasTc) {
          (updates as Record<string, unknown>).time_capsule_delay_minutes = minutesFromMs(revealDelayMs);
        }
        if (!hasDestruct) {
          (updates as Record<string, unknown>).destruct_delay_minutes = minutesFromMs(destructDelayMs);
        }

        const now = Date.now();
        const revealAtIso = new Date(now + revealDelayMs).toISOString();
        const destructAtIso = destructDelayMs > 0 ? new Date(now + destructDelayMs).toISOString() : null;

        (updates as Record<string, unknown>).reveal_at = revealAtIso;
        (updates as Record<string, unknown>).destruct_at = destructAtIso;
      }
    }
    
    const { data, error } = await updateMemory(id, updates);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Update failed', 500, { origin });
    }
    
    // Purge ISR data cache + route cache so updated content appears instantly
    revalidateTag('memories-feed', 'max');
    revalidatePath('/api/memories');
    revalidatePath('/memories');
    revalidatePath('/');

    return createSecureResponse({ success: true, data }, 200, { origin });
    
  } catch (error) {
    console.error('Admin update error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
