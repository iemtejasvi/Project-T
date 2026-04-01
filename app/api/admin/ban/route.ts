import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// Ban user
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const body = await request.json();
    const { ip, uuid, reason } = body;
    const sanitized = {
      ...(ip ? { ip: String(ip).slice(0, 45) } : {}),
      ...(uuid ? { uuid: String(uuid).slice(0, 36) } : {}),
      ...(reason ? { reason: String(reason).slice(0, 500) } : {}),
    };

    const { error } = await primaryDB
      .from('banned_users')
      .insert([sanitized]);
    
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
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
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
