import { NextRequest } from 'next/server';
import { fetchMemories } from '@/lib/dualMemoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

// Admin password - in production, use proper auth!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-secret-admin-password';

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== `Bearer ${ADMIN_PASSWORD}`) {
      return createSecureErrorResponse('Unauthorized', 401, { origin });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    
    // Fetch memories using service role (via dualMemoryDB)
    const { data, error } = await fetchMemories(
      { status },
      { pinned: "desc", created_at: "desc" }
    );
    
    if (error) {
      return createSecureErrorResponse('Failed to fetch memories', 500, { origin });
    }
    
    return createSecureResponse({ memories: data }, 200, { origin });
    
  } catch (error) {
    console.error('Admin API error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
