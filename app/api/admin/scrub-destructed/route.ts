import { NextRequest } from 'next/server';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { scrubDestructedMemories } from '@/lib/memoryDB';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  try {
    const scrubbed = await scrubDestructedMemories();
    if (scrubbed > 0) {
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');
    }
    return createSecureResponse({ success: true, scrubbed }, 200, { origin });
  } catch (error) {
    console.error('Scrub destructed memories error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
