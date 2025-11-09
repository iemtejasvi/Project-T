import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/dualMemoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

// Add unlimited user
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const body = await request.json();
    
    const { error } = await primaryDB
      .from('unlimited_users')
      .insert([body]);
    
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
  
  try {
    const body = await request.json();
    
    const { error } = await primaryDB
      .from('site_settings')
      .upsert(body);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to update settings', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Update settings error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
