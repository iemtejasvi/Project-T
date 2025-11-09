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
    
    const { data, error } = await updateMemory(id, updates);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Update failed', 500, { origin });
    }
    
    return createSecureResponse({ success: true, data }, 200, { origin });
    
  } catch (error) {
    console.error('Admin update error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
