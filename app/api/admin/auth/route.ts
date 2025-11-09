import { NextRequest } from 'next/server';
import { verifyAdminCredentials, generateSessionToken, isAdminAuthenticated, getSessionToken, deleteSession } from '@/lib/adminAuth';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';

// Login
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    const { username, password } = await request.json();
    
    if (!username || !password) {
      return createSecureErrorResponse('Missing credentials', 400, { origin });
    }
    
    if (!verifyAdminCredentials(username, password)) {
      // Add delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      return createSecureErrorResponse('Invalid credentials', 401, { origin });
    }
    
    const sessionToken = generateSessionToken(username);
    
    // Set secure HTTP-only cookie (1 year - effectively permanent)
    const response = createSecureResponse({ success: true }, 200, { origin });
    response.headers.set(
      'Set-Cookie',
      `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${365 * 24 * 60 * 60}${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    );
    
    return response;
    
  } catch (error) {
    console.error('Admin login error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Check auth status
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  const isAuthenticated = isAdminAuthenticated(request);
  
  return createSecureResponse({ authenticated: isAuthenticated }, 200, { origin });
}

// Logout
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  const token = getSessionToken(request);
  if (token) {
    deleteSession(token);
  }
  
  const response = createSecureResponse({ success: true }, 200, { origin });
  response.headers.set(
    'Set-Cookie',
    `admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
  );
  
  return response;
}
