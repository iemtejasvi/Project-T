// lib/rateLimiter.ts
// Advanced rate limiting system with multiple protection layers

interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  maxRequests: number;   // Maximum requests allowed in window
  blockDuration?: number; // How long to block if limit exceeded (ms)
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

// In-memory store for rate limits (use Redis in production for multi-server setups)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Different rate limits for different endpoints
export const RATE_LIMITS = {
  // Memory submission - strict limit
  SUBMIT_MEMORY: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 3,      // 3 requests per minute
    blockDuration: 60 * 1000 // Block for 1 minute if exceeded
  },
  
  // API reads - more lenient
  READ_MEMORIES: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,     // 60 requests per minute
    blockDuration: 60 * 1000 // Block for 1 minute if exceeded
  },
  
  // User status checks
  CHECK_STATUS: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,     // 30 requests per minute
    blockDuration: 60 * 1000
  },
  
  // General API protection
  GENERAL: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,    // 100 requests per minute
    blockDuration: 2 * 60 * 1000
  }
} as const;

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { 
  allowed: boolean; 
  remaining: number; 
  resetIn: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const key = identifier;
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  
  // Check if currently blocked
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetIn: retryAfter,
      retryAfter
    };
  }
  
  // Reset if window expired or no entry exists
  if (!entry || entry.resetTime < now) {
    entry = {
      count: 1, // Start at 1 for this request
      resetTime: now + config.windowMs
    };
    rateLimitStore.set(key, entry);
  } else {
    // Increment request count for existing entry
    entry.count++;
  }
  
  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    // Block the identifier if blockDuration is specified
    if (config.blockDuration) {
      entry.blockedUntil = now + config.blockDuration;
    }
    
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    const retryAfter = config.blockDuration 
      ? Math.ceil(config.blockDuration / 1000)
      : resetIn;
    
    return {
      allowed: false,
      remaining: 0,
      resetIn,
      retryAfter
    };
  }
  
  const remaining = config.maxRequests - entry.count;
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  
  return {
    allowed: true,
    remaining,
    resetIn
  };
}

/**
 * Clean up expired entries from the store (should be called periodically)
 */
export function cleanupRateLimitStore(): number {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, entry] of rateLimitStore.entries()) {
    // Remove if reset time and block time have both passed
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }
  
  return cleaned;
}

/**
 * Get rate limit store statistics
 */
export function getRateLimitStats() {
  return {
    totalEntries: rateLimitStore.size,
    entries: Array.from(rateLimitStore.entries()).map(([key, entry]) => ({
      identifier: key,
      count: entry.count,
      resetTime: new Date(entry.resetTime).toISOString(),
      blockedUntil: entry.blockedUntil ? new Date(entry.blockedUntil).toISOString() : null
    }))
  };
}

/**
 * Manually block an identifier (for banning purposes)
 */
export function blockIdentifier(identifier: string, durationMs: number = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  rateLimitStore.set(identifier, {
    count: 999999,
    resetTime: now + durationMs,
    blockedUntil: now + durationMs
  });
}

/**
 * Unblock an identifier
 */
export function unblockIdentifier(identifier: string) {
  rateLimitStore.delete(identifier);
}

/**
 * Generate a rate limit key from IP and UUID with fallback
 * @param ip - Client IP address
 * @param uuid - Client UUID
 * @param endpoint - Endpoint name to create separate buckets per API
 * @param fallback - Fallback identifier
 */
export function generateRateLimitKey(
  ip: string | null, 
  uuid: string | null, 
  endpoint: string = 'general',
  fallback: string = 'anonymous'
): string {
  let identifier: string;
  
  if (ip && ip.length > 6) {
    identifier = `ip:${ip}`;
  } else if (uuid && uuid.length > 10) {
    identifier = `uuid:${uuid}`;
  } else {
    identifier = `fallback:${fallback}`;
  }
  
  // Add endpoint to create separate rate limit buckets per API
  return `${endpoint}:${identifier}`;
}

// Auto-cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const cleaned = cleanupRateLimitStore();
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired rate limit entries`);
    }
  }, 10 * 60 * 1000);
}
