import { NextRequest } from 'next/server';
import { deleteMemory } from '@/lib/dualMemoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const { id } = await request.json();
    
    if (!id) {
      return createSecureErrorResponse('Missing id', 400, { origin });
    }
    
    const { data, error } = await deleteMemory(id);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Delete failed', 500, { origin });
    }
    
    return createSecureResponse({ success: true, data }, 200, { origin });
    
  } catch (error) {
    console.error('Admin delete error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
