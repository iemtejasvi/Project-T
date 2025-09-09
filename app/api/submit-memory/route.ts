import { NextRequest, NextResponse } from 'next/server';
import { insertMemory, countMemories, primaryDB } from '@/lib/dualMemoryDB';

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
interface IPServiceResponse {
  ip?: string;
  origin?: string;
  query?: string;
}

interface CountryServiceResponse {
  status?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  ip?: string;
  query?: string;
}

// Cache for IP detection to avoid repeated API calls
const ipCache = new Map<string, { ip: string | null; timestamp: number }>();
const IP_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for IP cache

async function getClientIP(request: NextRequest): Promise<string | null> {
  // Try multiple headers for IP detection first
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  const xClientIP = request.headers.get('x-client-ip');
  const xClusterClientIP = request.headers.get('x-cluster-client-ip');
  const xOriginalForwardedFor = request.headers.get('x-original-forwarded-for');
  const forwarded = request.headers.get('forwarded');
  
  // Check all possible IP headers
  const possibleIPs = [
    forwardedFor?.split(',')[0]?.trim(),
    realIP,
    cfConnectingIP,
    xClientIP,
    xClusterClientIP,
    xOriginalForwardedFor?.split(',')[0]?.trim(),
    forwarded?.match(/for=([^;,\s]+)/)?.[1]?.replace(/"/g, '')
  ].filter(Boolean);
  
  // Return first valid public IP from headers
  for (const ip of possibleIPs) {
    if (ip && isValidPublicIP(ip)) {
      console.log(`✅ Found valid public IP from headers: ${ip}`);
      return ip;
    }
  }
  
  // If no valid public IP from headers, try external IP detection services
  console.log('🔍 No valid public IP in headers, trying external detection...');
  return await getPublicIPFromServices();
}

function isValidPublicIP(ip: string): boolean {
  if (!ip) return false;
  
  // Remove any port numbers
  const cleanIP = ip.split(':')[0];
  
  // Check if it's localhost or private IP
  const isLocalhost = cleanIP === '::1' || cleanIP === '127.0.0.1' || cleanIP === 'localhost';
  const isPrivate = cleanIP.startsWith('192.168.') || 
                   cleanIP.startsWith('10.') || 
                   cleanIP.startsWith('172.16.') || cleanIP.startsWith('172.17.') ||
                   cleanIP.startsWith('172.18.') || cleanIP.startsWith('172.19.') ||
                   cleanIP.startsWith('172.2') || cleanIP.startsWith('172.3') ||
                   cleanIP.startsWith('169.254.'); // Link-local
  
  return !isLocalhost && !isPrivate && cleanIP.length > 6;
}

async function getPublicIPFromServices(): Promise<string | null> {
  // Check cache first
  const cacheKey = 'public_ip';
  const cached = ipCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < IP_CACHE_DURATION) {
    console.log(`🎯 IP Cache hit: ${cached.ip}`);
    return cached.ip;
  }

  // Array of public IP detection services with fallbacks
  const ipServices = [
    {
      name: 'ipify',
      url: 'https://api.ipify.org?format=json',
      extractIP: (data: IPServiceResponse) => data.ip,
      timeout: 3000,
      isJson: true
    },
    {
      name: 'ipapi.co',
      url: 'https://ipapi.co/ip/',
      extractIP: (data: string) => data.trim(),
      timeout: 3000,
      isJson: false
    },
    {
      name: 'ip-api.com',
      url: 'http://ip-api.com/json/?fields=query',
      extractIP: (data: IPServiceResponse) => data.query,
      timeout: 3000,
      isJson: true
    },
    {
      name: 'httpbin',
      url: 'https://httpbin.org/ip',
      extractIP: (data: IPServiceResponse) => data.origin,
      timeout: 4000,
      isJson: true
    },
    {
      name: 'ipinfo.io',
      url: 'https://ipinfo.io/ip',
      extractIP: (data: string) => data.trim(),
      timeout: 3000,
      isJson: false
    },
    {
      name: 'icanhazip',
      url: 'https://icanhazip.com',
      extractIP: (data: string) => data.trim(),
      timeout: 3000,
      isJson: false
    }
  ];

  for (const service of ipServices) {
    try {
      console.log(`Trying ${service.name} for IP detection...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), service.timeout);
      
      const response = await fetch(service.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MemoryApp/1.0)',
          'Accept': service.isJson ? 'application/json' : 'text/plain'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = service.isJson ? await response.json() : await response.text();
        const ip = service.extractIP(data);
        
        if (ip && isValidPublicIP(ip)) {
          console.log(`✅ ${service.name} detected IP: ${ip}`);
          // Cache the successful result
          ipCache.set(cacheKey, { ip, timestamp: Date.now() });
          return ip;
        } else {
          console.log(`⚠️ ${service.name} returned invalid IP: ${ip}`);
        }
      } else {
        console.log(`❌ ${service.name} HTTP error: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log(`⏱️ ${service.name} IP detection timed out`);
      } else {
        console.log(`❌ ${service.name} IP error:`, error instanceof Error ? error.message : String(error));
      }
    }
  }

  console.log('🚨 All IP detection services failed');
  // Cache the failed result to avoid repeated attempts
  ipCache.set(cacheKey, { ip: null, timestamp: Date.now() });
  return null;
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

// Simple in-memory cache for IP to country mapping
const countryCache = new Map<string, { country: string | null; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function getCountryFromIP(ip: string): Promise<{ country: string | null; detectedIP?: string }> {
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
      url: useAutoDetect ? `http://ip-api.com/json/?fields=status,country,query` : `http://ip-api.com/json/${ip}?fields=status,country`,
      extractCountry: (data: CountryServiceResponse) => data.status === 'success' ? data.country : null,
      extractIP: (data: CountryServiceResponse) => data.query || null,
      timeout: 3000,
      canAutoDetectIP: true
    },
    {
      name: 'ipapi.co',
      url: useAutoDetect ? `https://ipapi.co/json/` : `https://ipapi.co/${ip}/json/`,
      extractCountry: (data: CountryServiceResponse) => data.country_name || null,
      extractIP: (data: CountryServiceResponse) => data.ip || null,
      timeout: 3000,
      canAutoDetectIP: true
    },
    {
      name: 'ipinfo.io',
      url: useAutoDetect ? `https://ipinfo.io/json` : `https://ipinfo.io/${ip}/json`,
      extractCountry: (data: CountryServiceResponse) => data.country ? getCountryNameFromCode(data.country) : null,
      extractIP: (data: CountryServiceResponse) => data.ip || null,
      timeout: 4000,
      canAutoDetectIP: true
    },
    {
      name: 'ip2location',
      url: useAutoDetect ? `https://api.ip2location.io/?format=json` : `https://api.ip2location.io/?ip=${ip}&format=json`,
      extractCountry: (data: CountryServiceResponse) => data.country_name || null,
      extractIP: (data: CountryServiceResponse) => data.ip || null,
      timeout: 4000,
      canAutoDetectIP: true
    },
    {
      name: 'ipwhois.app',
      url: useAutoDetect ? `https://ipwhois.app/json/` : `https://ipwhois.app/json/${ip}`,
      extractCountry: (data: CountryServiceResponse) => data.country || null,
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
          countryCache.set(cacheKey, { country, timestamp: Date.now() });
          
          return { country, detectedIP: detectedIP || undefined };
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
  countryCache.set(ip, { country: null, timestamp: Date.now() });
  return { country: null };
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: SubmissionData & { uuid?: string } = await request.json();
    const { recipient, message, sender, color, full_bg, animation, tag, sub_tag, uuid, enableTypewriter, typewriter_enabled } = body;

    // Normalize typewriter flag from either field name
    const normalizedTypewriterEnabled =
      typeof enableTypewriter === 'boolean'
        ? enableTypewriter
        : (typeof typewriter_enabled === 'boolean' ? typewriter_enabled : undefined);

    // Basic validation
    if (!recipient || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: recipient and message are required.' },
        { status: 400 }
      );
    }

    // Word count validation
    const wordCount = message.trim().split(/[\s.]+/).filter(word => word.length > 0).length;
    if (wordCount > 50) {
      return NextResponse.json(
        { error: 'Message exceeds 50 word limit.' },
        { status: 400 }
      );
    }

    // Get client IP and UUID with multi-tier fallback system
    let clientIP = await getClientIP(request);
    const clientUUID = uuid || getCookieValue(request, 'user_uuid');
    
    // SUPER-ROBUST FALLBACK: If IP detection completely fails, 
    // try country services that can auto-detect IP too!
    let country = null;
    if (!clientIP) {
      console.log('🔄 IP detection failed, trying country services for IP auto-detection...');
      const result = await getCountryFromIP('auto');
      if (result.detectedIP) {
        clientIP = result.detectedIP;
        country = result.country;
        console.log(`🎯 Country service detected IP: ${clientIP} and country: ${country}`);
      }
    }
    
    // Owner exemption and localhost - skip all checks
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || 
                       host.includes('127.0.0.1') ||
                       host.includes('192.168.1.41') || // Your local network IP
                       host.startsWith('localhost:') ||
                       clientIP === '127.0.0.1' || 
                       clientIP === '::1' ||
                       clientIP === '192.168.1.41' ||
                       !clientIP; // No IP detected = likely localhost
    
    console.log(`🏠 Host: ${host}, IP: ${clientIP}, isLocalhost: ${isLocalhost}`);
    
    if (clientIP === '103.161.233.157' || isLocalhost) {
      console.log('✅ Localhost/Owner detected - skipping all limits');
      // Allow owner and localhost to submit without limits
    } else {
      // Enhanced ban check - multiple validation layers
      if (clientIP || clientUUID) {
        try {
          // Check if banned by IP or UUID with comprehensive query
          const banQueries = [];
          if (clientIP) banQueries.push(`ip.eq.${clientIP}`);
          if (clientUUID) banQueries.push(`uuid.eq.${clientUUID}`);
          
          if (banQueries.length > 0) {
            const { data: banData, error: banError } = await primaryDB
              .from('banned_users')
              .select('id, ip, uuid, country')
              .or(banQueries.join(','))
              .limit(1);

            if (banError) {
              console.error('Ban check error:', banError);
              return NextResponse.json(
                { error: 'Server error during validation. Please try again.' },
                { status: 500 }
              );
            }

            if (banData && banData.length > 0) {
              return NextResponse.json(
                { error: 'You are banned from submitting memories.' },
                { status: 403 }
              );
            }
          }

          // Enhanced memory count check - multiple validation approaches
          const memoryQueries = [];
          if (clientIP) memoryQueries.push(`ip.eq.${clientIP}`);
          if (clientUUID) memoryQueries.push(`uuid.eq.${clientUUID}`);
          
          if (memoryQueries.length > 0) {
            // First check: Count by IP/UUID across both databases
            if (clientIP && clientUUID) {
              // If we have both, check both IP and UUID across both databases
              const ipResult = await countMemories({ ip: clientIP });
              const uuidResult = await countMemories({ uuid: clientUUID });
              const totalCount = Math.max(ipResult.count, uuidResult.count);

              if (totalCount >= 6) {
                const randomMessage = memoryLimitMessages[Math.floor(Math.random() * memoryLimitMessages.length)];
                return NextResponse.json(
                  { error: randomMessage },
                  { status: 429 }
                );
              }
            } else {
              // Second check: Additional IP validation (in case UUID is spoofed)
              if (clientIP) {
                const { count: ipCount } = await countMemories({ ip: clientIP });
                if (ipCount >= 6) {
                  const randomMessage = memoryLimitMessages[Math.floor(Math.random() * memoryLimitMessages.length)];
                  return NextResponse.json(
                    { error: randomMessage },
                    { status: 429 }
                  );
                }
              }

              // Third check: Additional UUID validation (in case IP is spoofed)
              if (clientUUID) {
                const { count: uuidCount } = await countMemories({ uuid: clientUUID });
                if (uuidCount >= 6) {
                  const randomMessage = memoryLimitMessages[Math.floor(Math.random() * memoryLimitMessages.length)];
                  return NextResponse.json(
                    { error: randomMessage },
                    { status: 429 }
                  );
                }
              }
            }
          }
        } catch (error) {
          console.error('Validation error:', error);
          return NextResponse.json(
            { error: 'Server error during validation. Please try again.' },
            { status: 500 }
          );
        }
      }
    }

    // Get country from IP (if not already detected)
    if (!country && clientIP) {
      const result = await getCountryFromIP(clientIP);
      country = result.country;
    }

    // Prepare submission data
    const submissionData = {
      recipient: recipient.trim(),
      message: message.trim(),
      sender: sender?.trim() || null,
      status: 'pending',
      color: color || 'default',
      full_bg: true,
      animation: animation || null,
      ip: clientIP,
      country: country,
      uuid: clientUUID,
      tag: normalizedTypewriterEnabled ? tag : null,
      sub_tag: normalizedTypewriterEnabled ? sub_tag : null,
      typewriter_enabled: normalizedTypewriterEnabled ?? false,
      created_at: new Date().toISOString()
    };
    
    // Debug: log what we're storing
    console.log('Storing memory with typewriter_enabled:', submissionData.typewriter_enabled, 'tag:', submissionData.tag, 'sub_tag:', submissionData.sub_tag);

    // Cookie-assisted round-robin to avoid serverless state issues
    const currentPref = getCookieValue(request, 'rr_db');
    // First-time visitors get a randomized starting DB to avoid skew
    const nextPreferred: 'A' | 'B' = currentPref === 'A' ? 'B' : (currentPref === 'B' ? 'A' : (Math.random() < 0.5 ? 'A' : 'B'));

    // Insert into dual database system with round-robin and failover
    const { data, error, database } = await insertMemory(submissionData, nextPreferred);

    if (error) {
      console.error('Database insertion error:', error);
      return NextResponse.json(
        { error: `Failed to submit memory: ${error.message}` },
        { status: 500 }
      );
    }

    console.log(`Memory successfully stored in database ${database}`);

    // Success response with toggled rr cookie
    const res = NextResponse.json(
      { 
        success: true, 
        message: 'Memory submitted successfully and is pending approval.',
        data: { id: data.id }
      },
      { status: 201 }
    );
    try {
      res.headers.set('Set-Cookie', `rr_db=${nextPreferred}; Path=/; Max-Age=1800; SameSite=Lax; Secure`);
    } catch {}
    return res;

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit memories.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit memories.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to submit memories.' },
    { status: 405 }
  );
}
