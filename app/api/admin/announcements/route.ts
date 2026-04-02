import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { sanitizeUrl } from '@/lib/inputSanitizer';

// Create announcement
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const body = await request.json();
    const { message, expires_at, link_url, background_color, text_color, icon, title, is_dismissible } = body;
    const sanitized = {
      message: String(message || '').slice(0, 500),
      expires_at: String(expires_at || ''),
      ...(link_url ? { link_url: sanitizeUrl(String(link_url)) || undefined } : {}),
      ...(background_color ? { background_color: String(background_color).slice(0, 20) } : {}),
      ...(text_color ? { text_color: String(text_color).slice(0, 20) } : {}),
      ...(icon ? { icon: String(icon).slice(0, 10) } : {}),
      ...(title ? { title: String(title).slice(0, 200) } : {}),
      is_dismissible: typeof is_dismissible === 'boolean' ? is_dismissible : true,
    };

    // Insert new announcement first, then delete old ones (atomic-safe)
    const { data, error } = await primaryDB
      .from('announcements')
      .insert([sanitized])
      .select()
      .single();

    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to create announcement', 500, { origin });
    }

    // Only delete old announcements AFTER successful insert
    await primaryDB.from('announcements').delete().neq('id', data.id);
    
    return createSecureResponse({ success: true, data }, 201, { origin });
    
  } catch (error) {
    console.error('Announcement creation error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Delete announcement
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
      return createSecureErrorResponse('Missing announcement ID', 400, { origin });
    }
    
    const { error } = await primaryDB
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to delete announcement', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Announcement deletion error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
