import { NextRequest, NextResponse } from 'next/server';
import { countMemories, primaryDB } from '@/lib/dualMemoryDB';

function getClientIP(request: NextRequest): string | null {
  // Try multiple headers for IP detection
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback for when no IP headers are available
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

export async function POST(request: NextRequest) {
  try {
    // No request body needed

    // Get client IP and UUID
    const clientIP = getClientIP(request);
    // SECURITY: do not trust UUID provided in body; only use cookie value
    const clientUUID = getCookieValue(request, 'user_uuid');
    
    // Owner exemption and localhost
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || 
                       host.includes('127.0.0.1') ||
                       host.includes('192.168.1.41') || // Your local network IP
                       host.startsWith('localhost:') ||
                       clientIP === '127.0.0.1' || 
                       clientIP === '::1' ||
                       clientIP === '192.168.1.41' ||
                       !clientIP; // No IP detected = likely localhost
    
    if (clientIP === '103.161.233.157' || isLocalhost) {
      return NextResponse.json({
        canSubmit: true,
        isBanned: false,
        memoryCount: 0,
        isOwner: true
      });
    }

    let isBanned = false;
    let memoryCount = 0;
    let isUnlimited = false;

    // Check global override first
    const { data: settingsData } = await primaryDB
      .from('site_settings')
      .select('word_limit_disabled_until')
      .eq('id', 1)
      .single();
    const overrideUntil = settingsData?.word_limit_disabled_until ? new Date(settingsData.word_limit_disabled_until) : null;
    const now = new Date();
    const globalOverrideActive = overrideUntil ? now < overrideUntil : false;

    if (!globalOverrideActive && (clientIP || clientUUID)) {
      try {
        // Check ban status with multiple criteria
        const banQueries = [];
        if (clientIP) banQueries.push(`ip.eq.${clientIP}`);
        if (clientUUID) banQueries.push(`uuid.eq.${clientUUID}`);
        
        if (banQueries.length > 0) {
          const { data: banData, error: banError } = await primaryDB
            .from('banned_users')
            .select('id')
            .or(banQueries.join(','))
            .limit(1);

          if (banError) {
            console.error('Ban check error:', banError);
            return NextResponse.json(
              { error: 'Server error during validation.' },
              { status: 500 }
            );
          }

          isBanned = banData && banData.length > 0;
        }

        // Check memory count with multiple criteria
        if (!isBanned) {
          const memoryQueries = [];
          if (clientIP) memoryQueries.push(`ip.eq.${clientIP}`);
          if (clientUUID) memoryQueries.push(`uuid.eq.${clientUUID}`);
          
          if (memoryQueries.length > 0) {
            // Count memories across both databases
            let totalCount = 0;
            if (clientIP && clientUUID) {
              const ipResult = await countMemories({ ip: clientIP });
              const uuidResult = await countMemories({ uuid: clientUUID });
              totalCount = Math.max(ipResult.count, uuidResult.count);
            } else if (clientIP) {
              const result = await countMemories({ ip: clientIP });
              totalCount = result.count;
            } else if (clientUUID) {
              const result = await countMemories({ uuid: clientUUID });
              totalCount = result.count;
            }
            const countError = null; // No error from our unified function

            if (countError) {
              console.error('Memory count error:', countError);
              return NextResponse.json(
                { error: 'Server error during validation.' },
                { status: 500 }
              );
            }

            memoryCount = totalCount;
          }
        }
      } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json(
          { error: 'Server error during validation.' },
          { status: 500 }
        );
      }
    }

    // Unlimited check (either global override or specific user)
    if (!isUnlimited && !globalOverrideActive && (clientIP || clientUUID)) {
      const unlimitedQueries = [];
      if (clientIP) unlimitedQueries.push(`ip.eq.${clientIP}`);
      if (clientUUID) unlimitedQueries.push(`uuid.eq.${clientUUID}`);
      if (unlimitedQueries.length) {
        const { data: unData } = await primaryDB.from('unlimited_users').select('id').or(unlimitedQueries.join(',')).limit(1);
        isUnlimited = !!(unData && unData.length);
      }
    }

    const canSubmit = !isBanned && (isUnlimited || globalOverrideActive || memoryCount < 6);

    return NextResponse.json({
      canSubmit,
      isBanned,
      memoryCount,
      hasReachedLimit: isUnlimited || globalOverrideActive ? false : memoryCount >= 6,
      isOwner: false,
      isUnlimited,
      globalOverrideActive
    });

  } catch (error) {
    console.error('Unexpected server error:', error);
    return NextResponse.json(
      { error: 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to check user status.' },
    { status: 405 }
  );
}
