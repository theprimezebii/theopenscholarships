// lib/redis.ts - Graceful fallback to in-memory cache when Redis is unavailable
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

let redis: Redis | null = null;
let isRedisAvailable = false;

// In-memory fallback cache
const memoryCache = new Map<string, { value: any; expiry: number }>();

function getRedisClient(): Redis | null {
  if (!REDIS_URL) return null;
  if (redis) return redis;
  
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
      lazyConnect: true,
    });
    
    redis.on('error', () => {
      isRedisAvailable = false;
    });
    
    redis.on('ready', () => {
      isRedisAvailable = true;
    });
    
    // Don't await connection – let it happen in background
    redis.connect().catch(() => {});
    return redis;
  } catch {
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  
  if (client && isRedisAvailable) {
    try {
      const data = await client.get(key);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback to memory
    }
  }
  
  // Memory fallback
  const entry = memoryCache.get(key);
  if (entry && entry.expiry > Date.now()) {
    return entry.value;
  }
  return null;
}

export async function cacheSet(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
  const client = getRedisClient();
  
  if (client && isRedisAvailable) {
    try {
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return;
    } catch {
      // Fallback to memory
    }
  }
  
  // Memory fallback
  memoryCache.set(key, {
    value,
    expiry: Date.now() + ttlSeconds * 1000,
  });
  
  // Clean up expired entries occasionally
  if (memoryCache.size > 100) {
    const now = Date.now();
    for (const [k, v] of memoryCache.entries()) {
      if (v.expiry < now) memoryCache.delete(k);
    }
  }
}
