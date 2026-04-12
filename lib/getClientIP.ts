/**
 * Shared IP extraction utility for Cloudflare-proxied environments.
 * Prefers cf-connecting-ip (set by Cloudflare, cannot be spoofed by the client).
 * Falls back to x-forwarded-for (first entry) and x-real-ip for non-CF environments.
 */
export function getClientIP(request: Request): string | null {
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP.trim();

  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();

  return null;
}
