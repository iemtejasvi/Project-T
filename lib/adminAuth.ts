// lib/adminAuth.ts
// Simple admin authentication for API routes
// In production, use proper auth like NextAuth.js or Clerk

import { NextRequest } from 'next/server';
import { createHmac } from 'crypto';

// Admin credentials - MUST be set in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Fail safely if credentials not set
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('🚨 SECURITY ERROR: ADMIN_USERNAME or ADMIN_PASSWORD not set in environment variables!');
  console.error('Admin authentication will fail until these are configured.');
}

type SessionPayload = {
  username: string;
  exp: number; // unix seconds
};

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlEncodeString(input: string): string {
  return base64UrlEncodeBytes(Buffer.from(input, 'utf8'));
}

function base64UrlDecodeToString(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '==='.slice((base64.length + 3) % 4);
  return Buffer.from(padded, 'base64').toString('utf8');
}

async function signHmacSha256Base64Url(secret: string, data: string): Promise<string> {
  const anyCrypto = globalThis.crypto as Crypto | undefined;
  if (anyCrypto?.subtle) {
    const enc = new TextEncoder();
    const key = await anyCrypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await anyCrypto.subtle.sign('HMAC', key, enc.encode(data));
    return base64UrlEncodeBytes(new Uint8Array(sigBuf));
  }

  // Node fallback
  const sig = createHmac('sha256', secret).update(data).digest();
  return base64UrlEncodeBytes(sig);
}

function getAdminSessionSecret(): string {
  // You SHOULD set ADMIN_SESSION_SECRET in env.
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    ''
  );
}

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
  // Backward-compatible signature: keep the sync API, but produce a token that can be verified
  // without any in-memory state.
  const exp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
  const payload: SessionPayload = { username, exp };
  const payloadB64 = base64UrlEncodeString(JSON.stringify(payload));
  // Signature is computed in verify step if needed; here we produce an empty signature placeholder.
  // The auth route will generate the signed token using generateSignedSessionToken().
  return `${payloadB64}.`;
}

export async function generateSignedSessionToken(username: string): Promise<string> {
  const secret = getAdminSessionSecret();
  if (!secret) throw new Error('ADMIN_SESSION_SECRET not configured');

  const exp = Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60);
  const payload: SessionPayload = { username, exp };
  const payloadB64 = base64UrlEncodeString(JSON.stringify(payload));
  const sig = await signHmacSha256Base64Url(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

/**
 * Verify session token
 */
export function verifySessionToken(token: string): boolean {
  try {
    const [payloadB64, sigB64] = token.split('.');
    if (!payloadB64 || !sigB64) return false;

    const payloadRaw = base64UrlDecodeToString(payloadB64);
    const payload = JSON.parse(payloadRaw) as Partial<SessionPayload>;
    if (!payload || typeof payload.exp !== 'number' || typeof payload.username !== 'string') return false;
    if (payload.exp * 1000 < Date.now()) return false;

    const secret = getAdminSessionSecret();
    if (!secret) return false;

    // Sync verify on Node
    const expected = base64UrlEncodeBytes(createHmac('sha256', secret).update(payloadB64).digest());
    return expected === sigB64;
  } catch {
    return false;
  }
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
  // Stateless tokens can't be deleted server-side. Cookie deletion is handled by the logout route.
  void token;
}
