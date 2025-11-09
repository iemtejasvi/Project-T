import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/dualMemoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const body = await request.json();
    
    const { error } = await primaryDB
      .from('maintenance')
      .upsert(body);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to update maintenance', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Maintenance update error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
