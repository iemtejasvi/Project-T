// lib/rateLimiter.ts
// Redis-backed rate limiting with in-memory fallback

import { redis, withRedisTimeout } from './redis';

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

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  retryAfter?: number;
}

// In-memory fallback store (used when Redis is unavailable)
const rateLimitStore = new Map<string, RateLimitEntry>();
const MAX_STORE_SIZE = 50_000;

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

// Lua script for atomic rate limit check + increment + conditional block.
// Returns: [allowed (0/1), remaining, resetInSec, retryAfterSec]
const RATE_LIMIT_SCRIPT = `
local countKey = KEYS[1]
local blockKey = KEYS[2]
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local maxReqs = tonumber(ARGV[3])
local blockMs = tonumber(ARGV[4])

-- 1. Check active block
local blockedUntil = redis.call('GET', blockKey)
if blockedUntil then
  blockedUntil = tonumber(blockedUntil)
  if blockedUntil > now then
    local retryAfter = math.ceil((blockedUntil - now) / 1000)
    return {0, 0, retryAfter, retryAfter}
  end
end

-- 2. Get current count and resetTime
local count = tonumber(redis.call('HGET', countKey, 'count')) or 0
local resetTime = tonumber(redis.call('HGET', countKey, 'resetTime')) or 0

-- 3. Reset window if expired or first request
if resetTime < now or count == 0 then
  count = 1
  resetTime = now + windowMs
  redis.call('HSET', countKey, 'count', count, 'resetTime', resetTime)
  redis.call('PEXPIRE', countKey, windowMs + 5000)
else
  count = redis.call('HINCRBY', countKey, 'count', 1)
end

-- 4. Check if over limit
if count > maxReqs then
  local resetIn = math.ceil((resetTime - now) / 1000)
  local retryAfter = resetIn
  if blockMs > 0 then
    redis.call('SET', blockKey, tostring(now + blockMs), 'PX', blockMs)
    retryAfter = math.ceil(blockMs / 1000)
  end
  return {0, 0, resetIn, retryAfter}
end

-- 5. Allowed
local remaining = maxReqs - count
local resetIn = math.ceil((resetTime - now) / 1000)
return {1, remaining, resetIn, 0}
`;

/**
 * In-memory rate limit check (fallback when Redis is unavailable)
 */
function inMemoryCheckRateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();

  let entry = rateLimitStore.get(identifier);

  // Check if currently blocked
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, resetIn: retryAfter, retryAfter };
  }

  // Reset if window expired or no entry exists
  if (!entry || entry.resetTime < now) {
    // Evict oldest 20% if store is at capacity
    if (rateLimitStore.size >= MAX_STORE_SIZE) {
      const entries = Array.from(rateLimitStore.entries())
        .sort((a, b) => a[1].resetTime - b[1].resetTime);
      const toRemove = Math.max(1, Math.floor(entries.length * 0.2));
      for (let i = 0; i < toRemove; i++) {
        rateLimitStore.delete(entries[i][0]);
      }
    }
    entry = { count: 1, resetTime: now + config.windowMs };
    rateLimitStore.set(identifier, entry);
  } else {
    entry.count++;
  }

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    if (config.blockDuration) {
      entry.blockedUntil = now + config.blockDuration;
    }
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    const retryAfter = config.blockDuration
      ? Math.ceil(config.blockDuration / 1000)
      : resetIn;
    return { allowed: false, remaining: 0, resetIn, retryAfter };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Check if a request should be rate limited.
 * Uses Redis when available, falls back to in-memory.
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (!redis) return inMemoryCheckRateLimit(identifier, config);

  try {
    const now = Date.now();
    const countKey = `rl:count:${identifier}`;
    const blockKey = `rl:block:${identifier}`;

    const result = await withRedisTimeout(redis.eval(
      RATE_LIMIT_SCRIPT,
      [countKey, blockKey],
      [String(now), String(config.windowMs), String(config.maxRequests), String(config.blockDuration || 0)]
    )) as number[];

    const [allowed, remaining, resetIn, retryAfter] = result;
    return {
      allowed: allowed === 1,
      remaining,
      resetIn,
      ...(retryAfter > 0 ? { retryAfter } : {}),
    };
  } catch (err) {
    console.warn('Redis rate limit failed, using in-memory fallback:', err);
    return inMemoryCheckRateLimit(identifier, config);
  }
}

/**
 * Clean up expired entries. No-op with Redis (TTLs handle expiry).
 * Only cleans the in-memory fallback store.
 */
async function cleanupRateLimitStore(): Promise<number> {
  const now = Date.now();
  let cleaned = 0;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }
  return cleaned;
}

/**
 * Manually block an identifier (for banning purposes)
 */
export async function blockIdentifier(identifier: string, durationMs: number = 24 * 60 * 60 * 1000) {
  if (redis) {
    try {
      const now = Date.now();
      const blockKey = `rl:block:${identifier}`;
      const countKey = `rl:count:${identifier}`;
      const pipeline = redis.pipeline();
      pipeline.set(blockKey, String(now + durationMs), { px: durationMs });
      pipeline.hset(countKey, { count: 999999, resetTime: now + durationMs });
      pipeline.pexpire(countKey, durationMs);
      await withRedisTimeout(pipeline.exec());
      return;
    } catch (err) {
      console.warn('Redis block failed, using in-memory fallback:', err);
    }
  }

  const now2 = Date.now();
  rateLimitStore.set(identifier, {
    count: 999999,
    resetTime: now2 + durationMs,
    blockedUntil: now2 + durationMs
  });
}

/**
 * Unblock an identifier
 */
export async function unblockIdentifier(identifier: string) {
  if (redis) {
    try {
      const pipeline = redis.pipeline();
      pipeline.del(`rl:block:${identifier}`);
      pipeline.del(`rl:count:${identifier}`);
      await withRedisTimeout(pipeline.exec());
      return;
    } catch (err) {
      console.warn('Redis unblock failed, using in-memory fallback:', err);
    }
  }

  rateLimitStore.delete(identifier);
}

/**
 * Generate a rate limit key from IP and UUID with fallback
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
    // No identifiable user — randomize key to prevent shared bucket DoS
    identifier = `fallback:${fallback}:${Math.random().toString(36).slice(2, 8)}`;
  }

  return `${endpoint}:${identifier}`;
}
