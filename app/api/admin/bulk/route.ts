import { NextRequest } from 'next/server';
import { updateMemory, deleteMemory } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { revalidatePath, revalidateTag } from 'next/cache';

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
          const { data, error } = await updateMemory(id, { status: 'approved' });
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
