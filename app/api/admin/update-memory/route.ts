import { NextRequest } from 'next/server';
import { updateMemory } from '@/lib/dualMemoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const { id, updates } = await request.json();
    
    if (!id || !updates) {
      return createSecureErrorResponse('Missing id or updates', 400, { origin });
    }
    
    // If approving, compute approval-based timers.
    // Note: dualMemoryDB.MemoryData index signature is string|boolean|undefined, so keep updates compatible.
    const nextUpdates: Partial<Record<string, string | boolean | undefined>> = { ...updates };

    if (updates?.status === 'approved') {
      const approvedAt = new Date();
      nextUpdates.approved_at = approvedAt.toISOString();

      const tc = typeof updates?.time_capsule_delay_minutes === 'number' ? updates.time_capsule_delay_minutes : null;
      const dd = typeof updates?.destruct_delay_minutes === 'number' ? updates.destruct_delay_minutes : null;

      // If admin didn't pass these delays, we rely on existing DB values.
      // We still compute reveal/destruct safely based on approval time when possible.
      if (tc !== null) {
        nextUpdates.reveal_at = tc > 0
          ? new Date(approvedAt.getTime() + tc * 60 * 1000).toISOString()
          : approvedAt.toISOString();
      }

      if (dd !== null) {
        nextUpdates.destruct_at = dd > 0
          ? new Date(approvedAt.getTime() + dd * 60 * 1000).toISOString()
          : undefined;
      }

      // Ensure destruct never happens before reveal.
      if (typeof nextUpdates.reveal_at === 'string' && typeof nextUpdates.destruct_at === 'string') {
        const revealTs = new Date(nextUpdates.reveal_at).getTime();
        const destructTs = new Date(nextUpdates.destruct_at).getTime();
        if (Number.isFinite(revealTs) && Number.isFinite(destructTs)) {
          if (destructTs < revealTs) {
            nextUpdates.destruct_at = new Date(revealTs + 60 * 1000).toISOString();
          } else if (destructTs === revealTs) {
            nextUpdates.destruct_at = new Date(destructTs + 60 * 1000).toISOString();
          }
        }
      }
    }

    const { data, error } = await updateMemory(id, nextUpdates);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Update failed', 500, { origin });
    }
    
    return createSecureResponse({ success: true, data }, 200, { origin });
    
  } catch (error) {
    console.error('Admin update error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
