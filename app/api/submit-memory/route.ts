import { NextRequest } from 'next/server';
import { insertMemory, countMemories, primaryDB } from '@/lib/memoryDB';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { validateMemoryInput, sanitizeString, sanitizeUUID } from '@/lib/inputSanitizer';
import { createSecureResponse, createSecureErrorResponse, validateRequest, detectSuspiciousRequest } from '@/lib/securityHeaders';
import { revalidatePath, revalidateTag } from 'next/cache';

interface SubmissionData {
  recipient: string;
  message: string;
  sender?: string;
  color: string;
  full_bg: boolean;
  animation?: string;
  tag?: string;
  sub_tag?: string;
  enableTypewriter?: boolean;
  typewriter_enabled?: boolean;
  time_capsule_delay_minutes?: number;
  destruct_delay_minutes?: number;
  night_only?: boolean;
  night_tz?: string;
}

function isValidTimeCapsuleDelayMinutes(value: unknown): value is number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
    return false;
  }

  if (value === 0) return true;
  // Backward compatibility: allow any minute delay 1-60
  if (value >= 1 && value <= 60) return true;

  const allowed = new Set<number>([
    7 * 24 * 60,
    30 * 24 * 60,
    3 * 30 * 24 * 60,
    6 * 30 * 24 * 60,
    9 * 30 * 24 * 60,
    365 * 24 * 60,
  ]);
  return allowed.has(value);
}

function isValidDestructDelayMinutes(value: unknown): value is number {
  // Same presets/compatibility rules as time capsule.
  return isValidTimeCapsuleDelayMinutes(value);
}

const memoryLimitMessages = [
  "Only 6 memories allowed. Some goodbyes must stay in your heart.",
  "Only 6 memories allowed. Six pieces of your story, that's all we can hold.",
  "Only 6 memories allowed. Six moments of love, the rest stays with you.",
  "Only 6 memories allowed. Six fragments of forever, the rest is yours.",
  "Only 6 memories allowed. Six echoes of your heart, the rest remains.",
  "Only 6 memories allowed. Six pieces of your truth, the rest is private.",
  "Only 6 memories allowed. Six moments of courage, the rest is strength.",
  "Only 6 memories allowed. Six pieces of your soul, the rest is sacred.",
  "Only 6 memories allowed. Six echoes of love, the rest is yours.",
  "Only 6 memories allowed. Six pieces of your story, the rest is poetry."
];

// Type definitions for API responses

interface CountryServiceResponse {
  status?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  timezone?: string;
  ip?: string;
  query?: string;
}

async function getClientIP(request: NextRequest): Promise<string | null> {
  // On Vercel, x-forwarded-for is always present. Check headers only — no external calls.
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xClientIP = request.headers.get('x-client-ip');
  const xClusterClientIP = request.headers.get('x-cluster-client-ip');
  const xOriginalForwardedFor = request.headers.get('x-original-forwarded-for');
  const forwarded = request.headers.get('forwarded');

  const possibleIPs = [
    forwardedFor?.split(',')[0]?.trim(),
    realIP,
    cfConnectingIP,
    xClientIP,
    xClusterClientIP,
    xOriginalForwardedFor?.split(',')[0]?.trim(),
    forwarded?.match(/for=([^;,\s]+)/)?.[1]?.replace(/"/g, '')
  ].filter(Boolean);

  for (const ip of possibleIPs) {
    if (ip && isValidPublicIP(ip)) {
      return ip;
    }
  }

  return null;
}

function isValidPublicIP(ip: string): boolean {
  if (!ip) return false;

  // IPv6: accept any non-localhost IPv6 address as valid public
  if (ip === '::1') return false;
  if (ip.includes('::') || (ip.match(/:/g) || []).length > 1) {
    // It's an IPv6 address — treat as valid public IP
    return true;
  }

  // IPv4: strip port suffix if present (e.g. "1.2.3.4:8080")
  const cleanIP = ip.includes(':') ? ip.split(':')[0] : ip;

  const isLocalhost = cleanIP === '127.0.0.1' || cleanIP === 'localhost';

  // RFC 1918 private ranges + link-local
  let isPrivate = cleanIP.startsWith('192.168.') ||
                  cleanIP.startsWith('10.') ||
                  cleanIP.startsWith('169.254.');

  // 172.16.0.0 - 172.31.255.255: check second octet numerically
  if (!isPrivate && cleanIP.startsWith('172.')) {
    const secondOctet = parseInt(cleanIP.split('.')[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) isPrivate = true;
  }

  return !isLocalhost && !isPrivate && cleanIP.length > 6;
}

function getCookieValue(request: NextRequest, name: string): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
  const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
  
  if (targetCookie) {
    return targetCookie.split('=')[1];
  }
  
  return null;
}

// Simple in-memory cache for IP to country mapping (capped to prevent unbounded growth)
const countryCache = new Map<string, { country: string | null; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CACHE_SIZE = 10_000;

/** Evict oldest 20% of entries instead of clearing the entire cache (prevents thundering herd) */
function evictCountryCache() {
  const entries = Array.from(countryCache.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp);
  const toRemove = Math.max(1, Math.floor(entries.length * 0.2));
  for (let i = 0; i < toRemove; i++) {
    countryCache.delete(entries[i][0]);
  }
}

async function getCountryFromIP(ip: string): Promise<{ country: string | null; timezone?: string | null; detectedIP?: string }> {
  // Check cache first
  const cached = countryCache.get(ip);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log(`🎯 Cache hit for IP ${ip}: ${cached.country}`);
    return { country: cached.country };
  }

  // If no IP provided, try to get IP AND country from services
  const useAutoDetect = !ip || ip === 'auto';
  
  // Array of geolocation services - some can auto-detect IP too!
  const geoServices = [
    {
      name: 'ip-api.com',
      url: useAutoDetect ? `http://ip-api.com/json/?fields=status,country,timezone,query` : `http://ip-api.com/json/${ip}?fields=status,country,timezone`,
      extractCountry: (data: CountryServiceResponse) => data.status === 'success' ? data.country : null,
      extractTimezone: (data: CountryServiceResponse) => data.status === 'success' ? (data.timezone || null) : null,
      extractIP: (data: CountryServiceResponse) => data.query || null,
      timeout: 3000,
      canAutoDetectIP: true
    },
    {
      name: 'ipapi.co',
      url: useAutoDetect ? `https://ipapi.co/json/` : `https://ipapi.co/${ip}/json/`,
      extractCountry: (data: CountryServiceResponse) => data.country_name || null,
      extractTimezone: (data: CountryServiceResponse) => (data.timezone || null),
      extractIP: (data: CountryServiceResponse) => data.ip || null,
      timeout: 3000,
      canAutoDetectIP: true
    },
    {
      name: 'ipinfo.io',
      url: useAutoDetect ? `https://ipinfo.io/json` : `https://ipinfo.io/${ip}/json`,
      extractCountry: (data: CountryServiceResponse) => data.country ? getCountryNameFromCode(data.country) : null,
      extractTimezone: () => null,
      extractIP: (data: CountryServiceResponse) => data.ip || null,
      timeout: 4000,
      canAutoDetectIP: true
    },
    {
      name: 'ip2location',
      url: useAutoDetect ? `https://api.ip2location.io/?format=json` : `https://api.ip2location.io/?ip=${ip}&format=json`,
      extractCountry: (data: CountryServiceResponse) => data.country_name || null,
      extractTimezone: () => null,
      extractIP: (data: CountryServiceResponse) => data.ip || null,
      timeout: 4000,
      canAutoDetectIP: true
    },
    {
      name: 'ipwhois.app',
      url: useAutoDetect ? `https://ipwhois.app/json/` : `https://ipwhois.app/json/${ip}`,
      extractCountry: (data: CountryServiceResponse) => data.country || null,
      extractTimezone: () => null,
      extractIP: (data: CountryServiceResponse) => data.ip || null,
      timeout: 3000,
      canAutoDetectIP: true
    }
  ];

  // Helper function to convert country codes to names
  function getCountryNameFromCode(code: string): string | null {
    const countryCodes: Record<string, string> = {
      'US': 'United States', 'IN': 'India', 'CA': 'Canada', 'GB': 'United Kingdom',
      'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'JP': 'Japan',
      'BR': 'Brazil', 'RU': 'Russia', 'CN': 'China', 'MX': 'Mexico',
      'IT': 'Italy', 'ES': 'Spain', 'KR': 'South Korea', 'NL': 'Netherlands',
      'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark', 'FI': 'Finland',
      'PL': 'Poland', 'TR': 'Turkey', 'SA': 'Saudi Arabia', 'AE': 'United Arab Emirates',
      'SG': 'Singapore', 'MY': 'Malaysia', 'TH': 'Thailand', 'VN': 'Vietnam',
      'ID': 'Indonesia', 'PH': 'Philippines', 'BD': 'Bangladesh', 'PK': 'Pakistan',
      'EG': 'Egypt', 'ZA': 'South Africa', 'NG': 'Nigeria', 'KE': 'Kenya',
      'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru'
    };
    return countryCodes[code] || code;
  }

  // Try each service with timeout and error handling
  for (const service of geoServices) {
    try {
      console.log(`Trying ${service.name} for IP: ${ip}`);
      
      // Create AbortController for timeout
    const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), service.timeout);
      
      const response = await fetch(service.url, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MemoryApp/1.0)'
        }
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
        const country = service.extractCountry(data);
        const timezone = service.extractTimezone(data);
        
        if (country) {
          console.log(`✅ ${service.name} succeeded: ${country}`);
          
          // For auto-detect, also get the IP address
          let detectedIP = null;
          if (useAutoDetect && service.canAutoDetectIP) {
            detectedIP = service.extractIP(data);
            console.log(`🔍 ${service.name} also detected IP: ${detectedIP}`);
          }
          
          // Cache the successful result (use detected IP if available)
          const cacheKey = detectedIP || ip;
          if (countryCache.size >= MAX_CACHE_SIZE) evictCountryCache();
          countryCache.set(cacheKey, { country, timestamp: Date.now() });
          
          return { country, timezone: timezone || undefined, detectedIP: detectedIP || undefined };
        } else {
          console.log(`⚠️ ${service.name} returned no country data`);
        }
      } else {
        console.log(`❌ ${service.name} HTTP error: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`⏱️ ${service.name} timed out`);
      } else {
        console.log(`❌ ${service.name} error:`, error instanceof Error ? error.message : String(error));
      }
    }
  }

  console.log('🚨 All geolocation services failed for IP:', ip);
  // Cache the failed result to avoid repeated attempts for same IP
  if (countryCache.size >= MAX_CACHE_SIZE) countryCache.clear();
  countryCache.set(ip, { country: null, timestamp: Date.now() });
  return { country: null };
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  try {
    // 1. SECURITY: Validate request origin and method
    const requestValidation = validateRequest(request);
    if (!requestValidation.valid) {
      console.warn('🚨 Invalid request:', requestValidation.error);
      return createSecureErrorResponse(requestValidation.error || 'Invalid request', 403, { origin });
    }
    
    // 2. SECURITY: Detect suspicious patterns
    const suspiciousCheck = detectSuspiciousRequest(request);
    if (suspiciousCheck.suspicious) {
      console.warn('⚠️ Suspicious request detected:', suspiciousCheck.reasons);
      // Log but don't block - could be false positive
    }
    
    // Get client IP and UUID early for rate limiting
    let clientIP: string | null = await getClientIP(request);
    const clientUUID: string | null = sanitizeUUID(getCookieValue(request, 'user_uuid') || '');
    
    // 3. SECURITY: Rate limiting - check BEFORE parsing body
    const rateLimitKey = generateRateLimitKey(clientIP, clientUUID, 'submit');
    const rateLimit = await checkRateLimit(rateLimitKey, RATE_LIMITS.SUBMIT_MEMORY);
    
    if (!rateLimit.allowed) {
      return createSecureErrorResponse(
        'Too many requests. Please slow down and try again later.',
        429,
        { 
          origin,
          details: { 
            retryAfter: rateLimit.retryAfter,
            resetIn: rateLimit.resetIn 
          }
        }
      );
    }
    
    // 4. SECURITY: Parse and validate request body with size limit
    let body: SubmissionData & { uuid?: string };
    try {
      const text = await request.text();
      if (text.length > 100000) { // 100KB limit
        return createSecureErrorResponse('Request body too large', 413, { origin });
      }
      body = JSON.parse(text);
    } catch {
      return createSecureErrorResponse('Invalid JSON in request body', 400, { origin });
    }
    
    const { recipient, message, sender, color, full_bg, animation, tag, sub_tag, enableTypewriter, typewriter_enabled, time_capsule_delay_minutes, destruct_delay_minutes, night_only, night_tz } = body;

    // Normalize typewriter flag from either field name
    const normalizedTypewriterEnabled =
      typeof enableTypewriter === 'boolean'
        ? enableTypewriter
        : (typeof typewriter_enabled === 'boolean' ? typewriter_enabled : undefined);

    let isUnlimited = false;
    let globalOverrideActive = false;

    let country = null;

    // Owner exemption and localhost - skip all checks
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') ||
                       host.includes('127.0.0.1') ||
                       host.startsWith('localhost:') ||
                       clientIP === '127.0.0.1' ||
                       clientIP === '::1';

    // Check if IP matches owner (from environment variable)
    const ownerIP = process.env.OWNER_IP_ADDRESS;
    const isOwner = ownerIP && clientIP === ownerIP;

    console.log(`🏠 Host: ${host}, IP: ${clientIP}, isLocalhost: ${isLocalhost}, isOwner: ${isOwner}`);

    if (!isOwner && !isLocalhost) {
      // Run site_settings and unlimited_users queries in parallel
      const settingsPromise = primaryDB
        .from('site_settings')
        .select('word_limit_disabled_until')
        .eq('id', 1)
        .single();

      const unlimitedPromise = (clientIP || clientUUID)
        ? (() => {
            const unlimitedQueries: string[] = [];
            if (clientIP) unlimitedQueries.push(`ip.eq.${clientIP}`);
            if (clientUUID) unlimitedQueries.push(`uuid.eq.${clientUUID}`);
            return primaryDB
              .from('unlimited_users')
              .select('id')
              .or(unlimitedQueries.join(','))
              .limit(1);
          })()
        : Promise.resolve({ data: null });

      const [settingsResult, unlimitedResult] = await Promise.all([settingsPromise, unlimitedPromise]);

      const until = settingsResult.data?.word_limit_disabled_until ? new Date(settingsResult.data.word_limit_disabled_until) : null;
      globalOverrideActive = until ? new Date() < until : false;
      isUnlimited = !!(unlimitedResult.data && (unlimitedResult.data as unknown[]).length);
    }

    const allowLongWords = isOwner || isLocalhost || isUnlimited || globalOverrideActive;

    // 5. SECURITY: Comprehensive input validation and sanitization
    const validation = validateMemoryInput(
      {
        recipient,
        message,
        sender,
        color,
        animation,
        tag,
        sub_tag
      },
      { allowLongWords }
    );
    
    if (!validation.valid) {
      console.warn('❌ Input validation failed:', validation.errors);
      return createSecureErrorResponse(
        validation.errors[0] || 'Invalid input data',
        400,
        { origin, details: { errors: validation.errors } }
      );
    }
    
    // Use sanitized values
    const sanitizedRecipient = validation.sanitized.recipient as string;
    const sanitizedMessage = validation.sanitized.message as string;
    const sanitizedColor = (validation.sanitized.color as string) || 'default';
    const sanitizedAnimation = validation.sanitized.animation as string | undefined;

    // Sender validation: block phrase-style senders and reserved names
    const BLOCKED_SENDER_PHRASES = [
      'anonymous', 'anon', 'someone', 'nobody', 'unknown', 'guess who',
      'you know who', 'your secret admirer', 'the one who got away',
      'your friend', 'your ex', 'a friend', 'a stranger', 'no one',
      'me', 'myself', 'test', 'testing', 'null', 'undefined', 'none',
    ];
    let sanitizedSender = validation.sanitized.sender as string | undefined;
    if (sanitizedSender) {
      const trimmedSender = sanitizedSender.trim();
      const senderLower = trimmedSender.toLowerCase();
      // Block if > 30 chars (sentences), only numbers/symbols, or reserved
      if (
        trimmedSender.length > 30 ||
        !/[a-zA-Z]/.test(trimmedSender) ||
        BLOCKED_SENDER_PHRASES.includes(senderLower) ||
        /^(.)\1{3,}$/.test(senderLower)
      ) {
        sanitizedSender = undefined; // Will be stored as null (anonymous)
      }
    }

    let timeCapsuleDelayMinutes: number | undefined = undefined;
    if (typeof time_capsule_delay_minutes !== 'undefined') {
      if (!isValidTimeCapsuleDelayMinutes(time_capsule_delay_minutes)) {
        return createSecureErrorResponse('Invalid time capsule delay', 400, { origin });
      }
      timeCapsuleDelayMinutes = time_capsule_delay_minutes;
    }

    let destructDelayMinutes: number | undefined = undefined;
    if (typeof destruct_delay_minutes !== 'undefined') {
      if (!isValidDestructDelayMinutes(destruct_delay_minutes)) {
        return createSecureErrorResponse('Invalid destruct delay', 400, { origin });
      }
      destructDelayMinutes = destruct_delay_minutes;
    }

    const createdAtIso = new Date().toISOString();
    const revealAtIso =
      typeof timeCapsuleDelayMinutes === 'number' && timeCapsuleDelayMinutes > 0
        ? new Date(Date.now() + timeCapsuleDelayMinutes * 60 * 1000).toISOString()
        : createdAtIso;

    const destructAtIso =
      typeof destructDelayMinutes === 'number' && destructDelayMinutes > 0
        ? new Date(Date.now() + destructDelayMinutes * 60 * 1000).toISOString()
        : null;

    if (isOwner || isLocalhost) {
      console.log('✅ Localhost/Owner detected - skipping all limits');
      // Allow owner and localhost to submit without limits
    } else {
      // Enforce 50-word limit unless unlimited or global override
      {
        const wordCount = message.trim().split(/[\s.]+/).filter((word) => word.length > 0).length;
        if (wordCount > 50 && !isUnlimited && !globalOverrideActive) {
          return createSecureErrorResponse('Message exceeds 50 word limit.', 400, { origin });
        }
      }
      // Ban check + memory count check in parallel
      if (clientIP || clientUUID) {
        try {
          const banQueries = [];
          if (clientIP) banQueries.push(`ip.eq.${clientIP}`);
          if (clientUUID) banQueries.push(`uuid.eq.${clientUUID}`);

          // Start ban check
          const banPromise = banQueries.length > 0
            ? primaryDB
                .from('banned_users')
                .select('id')
                .or(banQueries.join(','))
                .limit(1)
            : Promise.resolve({ data: null, error: null });

          // Start count checks in parallel with ban check
          const needsCountCheck = !isUnlimited && !globalOverrideActive;
          const countPromise = needsCountCheck
            ? Promise.all([
                clientIP ? countMemories({ ip: clientIP }) : Promise.resolve({ count: 0 }),
                clientUUID ? countMemories({ uuid: clientUUID }) : Promise.resolve({ count: 0 }),
              ])
            : Promise.resolve(null);

          const [banResult, countResults] = await Promise.all([banPromise, countPromise]);

          // Check ban result
          if (banResult.error) {
            console.error('Ban check error:', banResult.error);
            return createSecureErrorResponse('Server error during validation. Please try again.', 500, { origin });
          }
          if (banResult.data && (banResult.data as unknown[]).length > 0) {
            return createSecureErrorResponse('You are banned from submitting memories.', 403, { origin });
          }

          // Check count result
          if (countResults) {
            const [ipResult, uuidResult] = countResults;
            const totalCount = Math.max(ipResult.count, uuidResult.count);
            if (totalCount >= 6) {
              const randomMessage = memoryLimitMessages[Math.floor(Math.random() * memoryLimitMessages.length)];
              return createSecureErrorResponse(randomMessage, 429, { origin });
            }
          }
        } catch (error) {
          console.error('Validation error:', error);
          return createSecureErrorResponse('Server error during validation. Please try again.', 500, { origin });
        }
      }
    }

    const nightOnlyEnabled = typeof night_only === 'boolean' ? night_only : false;
    const nightTzFromClient = typeof night_tz === 'string' && night_tz.length <= 64 ? night_tz : null;
    const nightStartHour = 21;
    const nightEndHour = 6;
    const nightTzFinal = nightOnlyEnabled
      ? (nightTzFromClient || 'UTC')
      : null;

    // Prepare submission data with sanitized values
    const submissionData = {
      recipient: sanitizedRecipient,
      message: sanitizedMessage,
      sender: sanitizedSender || null,
      color: sanitizedColor,
      full_bg: !!full_bg,
      animation: sanitizedAnimation || null,
      ip: clientIP,
      country: country,
      uuid: clientUUID,
      status: 'pending',
      tag: normalizedTypewriterEnabled ? (tag ? sanitizeString(tag).slice(0, 50) : null) : null,
      sub_tag: normalizedTypewriterEnabled ? (sub_tag ? sanitizeString(sub_tag).slice(0, 50) : null) : null,
      typewriter_enabled: normalizedTypewriterEnabled ?? false,
      time_capsule_delay_minutes: typeof timeCapsuleDelayMinutes === 'number' ? timeCapsuleDelayMinutes : 0,
      destruct_delay_minutes: typeof destructDelayMinutes === 'number' ? destructDelayMinutes : 0,
      created_at: createdAtIso,
      reveal_at: revealAtIso,
      destruct_at: destructAtIso,
      night_only: nightOnlyEnabled,
      night_tz: nightTzFinal,
      night_start_hour: nightStartHour,
      night_end_hour: nightEndHour,
    };

    try {
      // Insert memory into database
      const { data, error, database } = await insertMemory(submissionData);

      if (error || !data) {
        return createSecureErrorResponse(
          error?.message || 'Failed to submit memory. Please try again.',
          500,
          { origin }
        );
      }

      console.log(`✅ Memory successfully stored in database ${database} from ${rateLimitKey}`);

      // Fire-and-forget: resolve country from IP and update the row asynchronously.
      // This avoids blocking the response for 3-17s of external HTTP calls.
      if (clientIP && !country) {
        const memoryId = (data as Record<string, unknown>).id;
        getCountryFromIP(clientIP).then(async (geo) => {
          if (!geo.country && !geo.timezone) return;
          const update: Record<string, string | null> = {};
          if (geo.country) update.country = geo.country;
          // If night_only was enabled and no client tz, backfill detected tz
          if (nightOnlyEnabled && !nightTzFromClient && geo.timezone) {
            update.night_tz = geo.timezone;
          }
          if (Object.keys(update).length > 0) {
            await primaryDB.from('memories').update(update).eq('id', memoryId);
          }
        }).catch((err) => console.warn('Background geolocation update failed:', err));
      }

      // Purge ISR data cache + route cache so new content appears instantly
      revalidateTag('memories-feed', 'max');
      revalidatePath('/api/memories');
      revalidatePath('/memories');
      revalidatePath('/');

      // Success response with security headers
      return createSecureResponse(
        { 
          success: true, 
          message: 'Memory submitted successfully and is pending approval.',
          data: { id: (data as Record<string, unknown>).id }
        },
        201,
        { origin }
      );
    } catch (error) {
      console.error('❌ Unexpected server error:', error);
      return createSecureErrorResponse(
        'An unexpected server error occurred. Please try again.',
        500,
        { origin }
      );
    }
  } catch (error) {
    console.error('❌ Unexpected server error:', error);
    return createSecureErrorResponse(
      'An unexpected server error occurred. Please try again.',
      500,
      { origin }
    );
  }
}

// Handle other HTTP methods
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureErrorResponse(
    'Method not allowed. Use POST to submit memories.',
    405,
    { origin }
  );
}

export async function PUT(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureErrorResponse(
    'Method not allowed. Use POST to submit memories.',
    405,
    { origin }
  );
}

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureErrorResponse(
    'Method not allowed. Use POST to submit memories.',
    405,
    { origin }
  );
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return createSecureResponse(null, 204, { origin });
}
