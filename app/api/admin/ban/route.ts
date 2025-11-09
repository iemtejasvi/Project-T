import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/dualMemoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

// Ban user
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const body = await request.json();
    
    const { error } = await primaryDB
      .from('banned_users')
      .insert([body]);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to ban user', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 201, { origin });
    
  } catch (error) {
    console.error('Ban error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Unban user
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');
    const uuid = searchParams.get('uuid');
    
    if (ip) {
      await primaryDB.from('banned_users').delete().eq('ip', ip);
    }
    if (uuid) {
      await primaryDB.from('banned_users').delete().eq('uuid', uuid);
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Unban error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
