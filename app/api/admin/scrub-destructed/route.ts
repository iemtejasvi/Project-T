import { NextRequest } from 'next/server';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { scrubDestructedMemories } from '@/lib/dualMemoryDB';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  try {
    const scrubbed = await scrubDestructedMemories();
    return createSecureResponse({ success: true, scrubbed }, 200, { origin });
  } catch (error) {
    console.error('Scrub destructed memories error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
