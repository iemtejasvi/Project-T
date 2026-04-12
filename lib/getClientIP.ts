/**
 * Shared IP extraction utility for Cloudflare-proxied environments.
 *
 * SECURITY NOTE:
 * - cf-connecting-ip is set by Cloudflare and CANNOT be spoofed by clients.
 * - x-forwarded-for / x-real-ip CAN be spoofed when requests bypass Cloudflare
 *   (e.g., direct *.vercel.app access, preview deployments).
 * - In production we strongly prefer cf-connecting-ip. The spoofable fallbacks
 *   are kept only so rate-limiting still has *some* key when cf-connecting-ip is
 *   absent (e.g., local dev, health checks). They must NEVER be trusted for
 *   authentication — see isAdminAuthenticated() which only reads cf-connecting-ip.
 */
export function getClientIP(request: Request): string | null {
  // 1. Trusted header — Cloudflare sets this, clients cannot forge it.
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP.trim();

  // 2. Spoofable fallbacks — useful for rate-limit keying only.
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();

  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();

  return null;
}
