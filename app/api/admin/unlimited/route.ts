import { NextRequest } from 'next/server';
import { primaryDB } from '@/lib/memoryDB';
import { createSecureResponse, createSecureErrorResponse } from '@/lib/securityHeaders';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { checkRateLimit, RATE_LIMITS, generateRateLimitKey } from '@/lib/rateLimiter';
import { getClientIP } from '@/lib/getClientIP';

// Get unlimited users and site settings
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  try {
    const [usersResult, settingsResult] = await Promise.all([
      primaryDB
        .from('unlimited_users')
        .select('id, ip, uuid, created_at')
        .order('created_at', { ascending: false }),
      primaryDB
        .from('site_settings')
        .select('word_limit_disabled_until')
        .eq('id', 1)
        .maybeSingle(),
    ]);

    return createSecureResponse({
      success: true,
      data: {
        users: usersResult.data || [],
        word_limit_disabled_until: settingsResult.data?.word_limit_disabled_until || null,
      },
    }, 200, { origin, cacheControl: 'no-store' });
  } catch (error) {
    console.error('Fetch unlimited users error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Add unlimited user
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-unlimited'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }
  
  try {
    const body = await request.json();
    const { ip, uuid, reason } = body;
    const sanitized = {
      ...(ip ? { ip: String(ip).slice(0, 45) } : {}),
      ...(uuid ? { uuid: String(uuid).slice(0, 36) } : {}),
      ...(reason ? { reason: String(reason).slice(0, 500) } : {}),
    };

    const { error } = await primaryDB
      .from('unlimited_users')
      .insert([sanitized]);
    
    if (error) {
      console.error('Add unlimited user error:', error.message);
      return createSecureErrorResponse('Failed to add user', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 201, { origin });
    
  } catch (error) {
    console.error('Add unlimited user error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Remove unlimited user
export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-unlimited'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return createSecureErrorResponse('Missing user ID', 400, { origin });
    }
    
    const { error } = await primaryDB
      .from('unlimited_users')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Remove unlimited user error:', error.message);
      return createSecureErrorResponse('Failed to remove user', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Remove unlimited user error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}

// Update site settings (global word limit)
export async function PATCH(request: NextRequest) {
  const origin = request.headers.get('origin');

  if (!isAdminAuthenticated(request)) {
    return createSecureErrorResponse('Unauthorized', 401, { origin });
  }

  const ip = getClientIP(request) || 'anonymous';
  const rl = await checkRateLimit(generateRateLimitKey(ip, null, 'admin-settings'), RATE_LIMITS.ADMIN_MUTATION);
  if (!rl.allowed) {
    return createSecureErrorResponse('Too many requests.', 429, { origin, details: { retryAfter: rl.retryAfter } });
  }
  
  try {
    const body = await request.json();
    const { id, word_limit_disabled_until } = body;

    // Validate: must be null or a valid ISO date string
    let validatedUntil: string | null = null;
    if (word_limit_disabled_until !== undefined && word_limit_disabled_until !== null) {
      const parsed = new Date(String(word_limit_disabled_until));
      if (!Number.isFinite(parsed.getTime())) {
        return createSecureErrorResponse('Invalid date for word_limit_disabled_until', 400, { origin });
      }
      validatedUntil = parsed.toISOString();
    }

    const sanitized = {
      id: id ?? 1,
      word_limit_disabled_until: validatedUntil,
    };

    const { error } = await primaryDB
      .from('site_settings')
      .upsert(sanitized);
    
    if (error) {
      console.error('Update settings error:', error.message);
      return createSecureErrorResponse('Failed to update settings', 500, { origin });
    }
    
    return createSecureResponse({ success: true }, 200, { origin });
    
  } catch (error) {
    console.error('Update settings error:', error);
    return createSecureErrorResponse('Server error', 500, { origin });
  }
}
