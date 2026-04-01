import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const body = await request.json();
    const { id, is_active, message, started_at, expected_end } = body;
    const sanitized = {
      id: id ?? 1,
      is_active: typeof is_active === 'boolean' ? is_active : false,
      ...(message ? { message: String(message).slice(0, 500) } : {}),
      ...(started_at ? { started_at: String(started_at) } : {}),
      ...(expected_end ? { expected_end: String(expected_end) } : {}),
    };

    const { error } = await primaryDB
      .from('maintenance')
      .upsert(sanitized);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to update maintenance', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Maintenance update error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
