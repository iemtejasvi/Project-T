import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;

if (url && token) {
  redis = new Redis({ url, token });
} else {
  console.warn('Upstash Redis not configured — rate limiting will use in-memory fallback');
}

export { redis };
export const redisAvailable = redis !== null;
