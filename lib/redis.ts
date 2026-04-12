import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

if (url && token) {
  redis = new Redis({ url, token });
} else {
  console.warn('Upstash Redis not configured — rate limiting will use in-memory fallback');
}

/** Wrap any Redis call with a hard timeout so slow Upstash never hangs a Vercel function. */
const REDIS_TIMEOUT_MS = 3000; // 3s max — fail fast, fall back to in-memory

export function withRedisTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Redis timeout')), REDIS_TIMEOUT_MS)
    ),
  ]);
}

export { redis };
