import { NextRequest } from 'next/server';
import { unblockIdentifier } from '@/lib/rateLimiter';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // Check authentication
  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }
  
  try {
    const { identifier } = await request.json();
    
    if (!identifier) {
      return createSecureErrorResponse('Missing identifier (IP or UUID)', 400, { origin });
    }
    
    // Clear the rate limit for this identifier
    unblockIdentifier(identifier);
    
    return createSecureResponse({ 
      success: true, 
      message: `Rate limit cleared for ${identifier}` 
    }, 200, { origin });
    
  } catch (error) {
    console.error('Clear rate limit error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
