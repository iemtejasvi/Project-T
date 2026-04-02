import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { sanitizeString } from '@/lib/inputSanitizer';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { unstable_cache } from 'next/cache';
import { isLinkableName, sanitizeForPostgrestFilter } from '@/lib/nameUtils';

// Normalize name: lowercase, trim, collapse whitespace, remove dangerous chars
function normalizeName(raw: string): string {
  return sanitizeString(raw)
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100);
}

// Display name: capitalize first letter of each word
function displayName(normalized: string): string {
  return normalized
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ISR cached query: fetch memories for a name (as recipient or sender)
const getCachedNameMemories = unstable_cache(
  async (normalizedName: string, page: number, pageSize: number) => {
    const nowIso = new Date().toISOString();
    const safeName = sanitizeForPostgrestFilter(normalizedName);

    // Query memories where recipient OR sender matches the name (case-insensitive)
    let query = supabaseServer
      .from('memories')
      .select('id, recipient, message, sender, created_at, reveal_at, destruct_at, time_capsule_delay_minutes, status, color, full_bg, animation, pinned, pinned_until, tag, sub_tag, typewriter_enabled', { count: 'estimated' })
      .eq('status', 'approved')
      .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
      .or(`recipient.ilike.${safeName},sender.ilike.${safeName}`);

    query = query.order('created_at', { ascending: false });

    const start = page * pageSize;
    const end = start + pageSize - 1;
    query = query.range(start, end);

    const { data, count, error } = await query;

    if (error) {
      return { data: [], totalCount: 0, totalPages: 0, error: error.message };
    }

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / pageSize);

    return { data: data || [], totalCount, totalPages, error: null };
  },
  ['name-archive'],
  { revalidate: 60, tags: ['memories-feed'] }
);

// Check if a name exists (has at least one approved memory)
const getCachedNameExists = unstable_cache(
  async (normalizedName: string) => {
    const nowIso = new Date().toISOString();
    const safeName = sanitizeForPostgrestFilter(normalizedName);

    const { count, error } = await supabaseServer
      .from('memories')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved')
      .or(`reveal_at.is.null,reveal_at.lte.${nowIso}`)
      .or(`recipient.ilike.${safeName},sender.ilike.${safeName}`);

    if (error) return false;
    return (count || 0) > 0;
  },
  ['name-exists'],
  { revalidate: 120, tags: ['memories-feed'] }
);

// Fetch related names: other recipients/senders that appear in the same memories
const getCachedRelatedNames = unstable_cache(
  async (normalizedName: string) => {
    // Get memories where this name is recipient or sender
    const safeName = sanitizeForPostgrestFilter(normalizedName);
    const { data, error } = await supabaseServer
      .from('memories')
      .select('recipient, sender')
      .eq('status', 'approved')
      .or(`recipient.ilike.${safeName},sender.ilike.${safeName}`)
      .limit(200);

    if (error || !data) return [];

    const nameMap = new Map<string, string>();
    for (const m of data) {
      if (m.recipient) {
        const key = m.recipient.trim().toLowerCase();
        if (!nameMap.has(key)) nameMap.set(key, m.recipient.trim());
      }
      if (m.sender) {
        const key = m.sender.trim().toLowerCase();
        if (!nameMap.has(key)) nameMap.set(key, m.sender.trim());
      }
    }
    // Remove the current name and filter for linkable names only
    const related: string[] = [];
    for (const [key, display] of nameMap) {
      if (key === normalizedName) continue;
      if (!isLinkableName(display)) continue;
      related.push(display);
      if (related.length >= 8) break;
    }
    return related;
  },
  ['related-names'],
  { revalidate: 300, tags: ['memories-feed'] }
);

export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'anonymous';
    const rateLimitKey = generateRateLimitKey(ip, null, 'read');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.READ_MEMORIES);

    if (!rateLimit.allowed) {
      return createSecureErrorResponse('Too many requests.', 429, {
        origin,
        details: { retryAfter: rateLimit.retryAfter },
      });
    }

    const { searchParams } = new URL(request.url);
    const rawName = searchParams.get('name') || '';
    const page = Math.max(0, Math.min(10000, parseInt(searchParams.get('page') || '0', 10) || 0));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '20', 10) || 20));

    const name = normalizeName(rawName);

    if (!name || name.length < 1) {
      return createSecureErrorResponse('Name parameter is required', 400, { origin });
    }

    // Check existence first (cheap query)
    const exists = await getCachedNameExists(name);
    if (!exists) {
      return createSecureResponse(
        { data: [], totalCount: 0, totalPages: 0, exists: false, name, displayName: displayName(name) },
        200,
        { origin, cacheControl: 'public, s-maxage=120, stale-while-revalidate=300' }
      );
    }

    const [result, relatedNames] = await Promise.all([
      getCachedNameMemories(name, page, pageSize),
      page === 0 ? getCachedRelatedNames(name) : Promise.resolve([]),
    ]);

    return createSecureResponse(
      {
        ...result,
        exists: true,
        name,
        displayName: displayName(name),
        currentPage: page,
        relatedNames: page === 0 ? relatedNames : undefined,
      },
      200,
      { origin, cacheControl: 'public, s-maxage=60, stale-while-revalidate=120' }
    );
  } catch (error) {
    console.error('Error in names API:', error);
    return createSecureErrorResponse('Internal server error', 500, { origin });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
