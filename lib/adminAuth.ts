// lib/adminAuth.ts
// Simple admin authentication for API routes
// In production, use proper auth like NextAuth.js or Clerk

import { NextRequest } from 'next/server';

// Admin credentials - MUST be set in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Fail safely if credentials not set
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('🚨 SECURITY ERROR: ADMIN_USERNAME or ADMIN_PASSWORD not set in environment variables!');
  console.error('Admin authentication will fail until these are configured.');
}

// Simple session store (use Redis in production)
const sessions = new Map<string, { username: string; expiresAt: number }>();

// Clean up expired sessions every hour
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}, 60 * 60 * 1000);

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  // Fail safely if credentials not configured
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('🚨 Cannot verify credentials: ADMIN credentials not set in environment');
    return false;
  }
  
  // In production, use bcrypt to compare hashed passwords
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

/**
 * Generate a session token
 */
export function generateSessionToken(username: string): string {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year (effectively never expires)
  
  sessions.set(token, { username, expiresAt });
  
  return token;
}

/**
 * Verify session token
 */
export function verifySessionToken(token: string): boolean {
  const session = sessions.get(token);
  
  if (!session) return false;
  
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return false;
  }
  
  return true;
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string | null {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
         request.headers.get('x-real-ip') ||
         null;
}

/**
 * Middleware to check if request is from authenticated admin
 */
export function isAdminAuthenticated(request: NextRequest): boolean {
  // Check if IP matches admin IP (auto-login for owner)
  const adminIP = process.env.ADMIN_IP_ADDRESS;
  if (adminIP) {
    const clientIP = getClientIP(request);
    if (clientIP === adminIP) {
      console.log('✅ Admin IP detected - auto-authenticated');
      return true;
    }
  }
  
  // Check for session token in cookie
  const cookies = request.headers.get('cookie');
  if (!cookies) return false;
  
  const sessionToken = cookies
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('admin_session='))
    ?.split('=')[1];
  
  if (!sessionToken) return false;
  
  return verifySessionToken(sessionToken);
}

/**
 * Extract session token from request
 */
export function getSessionToken(request: NextRequest): string | null {
  const cookies = request.headers.get('cookie');
  if (!cookies) return null;
  
  return cookies
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('admin_session='))
    ?.split('=')[1] || null;
}

/**
 * Delete session
 */
export function deleteSession(token: string): void {
  sessions.delete(token);
}
