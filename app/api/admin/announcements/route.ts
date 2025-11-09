import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/dualMemoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

// Create announcement
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const body = await request.json();
    
    // Delete all existing announcements first
    await primaryDB.from('announcements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Create new announcement
    const { data, error } = await primaryDB
      .from('announcements')
      .insert([body])
      .select()
      .single();
    
    if (error) {
      return createSecureErrorResponse(error.message || 'Failed to create announcement', 500, { origin });
    }
    
    return createSecureResponse({ success: true, data }, 201, { origin });
    
  } catch (error) {
    console.error('Announcement creation error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Delete announcement
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  
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
