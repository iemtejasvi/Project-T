import { NextRequest } from 'next/server';
import { verifyAdminCredentials, generateSignedSessionToken, isAdminAuthenticated } from '@/lib/adminAuth';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { checkRateLimit, generateRateLimitKey } from '@/lib/rateLimiter';

// Login
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    // Rate limit login attempts: 5 per minute per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') || 'anonymous';
    const rateLimitKey = generateRateLimitKey(ip, null, 'admin-login');
    const rateLimit = await checkRateLimit(rateLimitKey, {
      windowMs: 60 * 1000,
      maxRequests: 5,
      blockDuration: 5 * 60 * 1000, // Block for 5 min after exceeding
    });
    if (!rateLimit.allowed) {
      return createSecureErrorResponse('Too many login attempts. Please try again later.', 429, {
        origin, details: { retryAfter: rateLimit.retryAfter },
      });
    }

    const { username, password } = await request.json();
    
    if (!username || !password) {
      return createSecureErrorResponse('Missing credentials', 400, { origin });
    }
    
    if (!verifyAdminCredentials(username, password)) {
      // Add delay to prevent brute force
      await new Promise(resolve => setTimeout(resolve, 1000));
      return createSecureErrorResponse('Invalid credentials', 401, { origin });
    }
    
    const sessionToken = await generateSignedSessionToken(username);
    
    // Set secure HTTP-only cookie (1 year - effectively permanent)
    const response = createSecureResponse({ success: true }, 200, { origin });
    response.headers.set(
      'Set-Cookie',
      `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}${
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

  try {
    const isAuthenticated = isAdminAuthenticated(request);

    // Only expose autoAuth status to authenticated users
    const response: Record<string, unknown> = { authenticated: isAuthenticated };
    if (isAuthenticated) {
      const adminIP = process.env.ADMIN_IP_ADDRESS;
      const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                       request.headers.get('x-real-ip') ||
                       null;
      response.autoAuth = Boolean(adminIP && clientIP === adminIP);
    }

    return createSecureResponse(response, 200, { origin });
  } catch {
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Logout
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  const response = createSecureResponse({ success: true }, 200, { origin });
  response.headers.set(
    'Set-Cookie',
    `admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
  );
  
  return response;
}
