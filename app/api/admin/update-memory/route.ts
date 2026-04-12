import { NextRequest } from 'next/server';
import { updateMemory, primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { sanitizeString } from '@/lib/inputSanitizer';
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

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-update'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }

  try {
    const { id, updates } = await request.json();
    
    if (!id || !updates || typeof updates !== 'object') {
      return createSecureErrorResponse('Missing id or updates', 400, { origin });
    }

    // Whitelist allowed fields with type validation
    const FIELD_VALIDATORS: Record<string, (v: unknown) => unknown> = {
      status: (v) => typeof v === 'string' && ['pending', 'approved', 'banned'].includes(v) ? v : undefined,
      recipient: (v) => typeof v === 'string' ? sanitizeString(v).slice(0, 100) : undefined,
      message: (v) => typeof v === 'string' ? sanitizeString(v).slice(0, 5000) : undefined,
      sender: (v) => v === null ? null : (typeof v === 'string' ? sanitizeString(v).slice(0, 100) : undefined),
      color: (v) => typeof v === 'string' ? v.slice(0, 50) : undefined,
      full_bg: (v) => typeof v === 'boolean' ? v : undefined,
      animation: (v) => v === null ? null : (typeof v === 'string' ? v.slice(0, 50) : undefined),
      pinned: (v) => typeof v === 'boolean' ? v : undefined,
      pinned_until: (v) => v === null ? null : (typeof v === 'string' ? v : undefined),
      reveal_at: (v) => v === null ? null : (typeof v === 'string' ? v : undefined),
      destruct_at: (v) => v === null ? null : (typeof v === 'string' ? v : undefined),
      time_capsule_delay_minutes: (v) => typeof v === 'number' && Number.isFinite(v) ? v : undefined,
      destruct_delay_minutes: (v) => typeof v === 'number' && Number.isFinite(v) ? v : undefined,
      tag: (v) => v === null ? null : (typeof v === 'string' ? sanitizeString(v).slice(0, 50) : undefined),
      sub_tag: (v) => v === null ? null : (typeof v === 'string' ? sanitizeString(v).slice(0, 50) : undefined),
      typewriter_enabled: (v) => typeof v === 'boolean' ? v : undefined,
      night_only: (v) => typeof v === 'boolean' ? v : undefined,
      night_tz: (v) => v === null ? null : (typeof v === 'string' ? v.slice(0, 64) : undefined),
      night_start_hour: (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 23 ? v : undefined,
      night_end_hour: (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 23 ? v : undefined,
    };
    const sanitizedUpdates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates as Record<string, unknown>)) {
      const validator = FIELD_VALIDATORS[key];
      if (!validator) continue;
      const validated = validator(value);
      if (validated !== undefined) {
        sanitizedUpdates[key] = validated;
      }
    }

    // If transitioning to approved, start timers from approval time.
    const nextStatus = String(sanitizedUpdates.status ?? '').toLowerCase();
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
          sanitizedUpdates.time_capsule_delay_minutes = minutesFromMs(revealDelayMs);
        }
        if (!hasDestruct) {
          sanitizedUpdates.destruct_delay_minutes = minutesFromMs(destructDelayMs);
        }

        const now = Date.now();
        const revealAtIso = new Date(now + revealDelayMs).toISOString();
        const destructAtIso = destructDelayMs > 0 ? new Date(now + destructDelayMs).toISOString() : null;

        sanitizedUpdates.reveal_at = revealAtIso;
        sanitizedUpdates.destruct_at = destructAtIso;
      }
    }

    const { data, error } = await updateMemory(id, sanitizedUpdates as Record<string, string | boolean | undefined>);
    
    if (error) {
      console.error('Memory update error:', error.message);
      return createSecureErrorResponse('Update failed', 500, { origin });
    }
    
    // Purge ISR data cache + route cache so updated content appears instantly
    revalidateTag('memories-feed', 'max');
    revalidateTag('name-data', 'max');
    revalidatePath('/api/memories');
    revalidatePath('/memories');
    revalidatePath('/');

    return createSecureResponse({ success: true, data }, 200, { origin });
    
  } catch (error) {
    console.error('Admin update error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
