import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';

// Add unlimited user
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
      .from('unlimited_users')
      .insert([sanitized]);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to add user', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 201, { origin });
    
  } catch (error) {
    console.error('Add unlimited user error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Remove unlimited user
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return createSecureErrorResponse('Missing user ID', 400, { origin });
    }
    
    const { error } = await primaryDB
      .from('unlimited_users')
      .delete()
      .eq('id', id);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to remove user', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Remove unlimited user error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Update site settings (global word limit)
export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const body = await request.json();
    const { id, word_limit_disabled_until } = body;
    const sanitized = {
      id: id ?? 1,
      ...(word_limit_disabled_until !== undefined ? { word_limit_disabled_until } : {}),
    };

    const { error } = await primaryDB
      .from('site_settings')
      .upsert(sanitized);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to update settings', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Update settings error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
