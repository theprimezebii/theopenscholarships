import { LRUCache } from 'lru-cache';
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  interval: number;      // Time window in seconds
  maxRequests: number;   // Max requests per interval
  message?: string;
}

// In-memory store (clears on server restart)
const tokenCache = new LRUCache<string, number[]>({
  max: 10000, // Max unique IPs to track
  ttl: 1000 * 60 * 15, // 15 minutes TTL
});

export async function rateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'anonymous';
  
  const key = `rate-limit:${ip}`;
  const now = Date.now();
  const windowStart = now - options.interval * 1000;
  
  // Get existing timestamps and filter out old ones
  const timestamps = tokenCache.get(key) || [];
  const validTimestamps = timestamps.filter(ts => ts > windowStart);
  
  const remaining = Math.max(0, options.maxRequests - validTimestamps.length);
  const reset = Math.ceil((validTimestamps[0] + options.interval * 1000 - now) / 1000) || options.interval;
  
  if (validTimestamps.length >= options.maxRequests) {
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      reset,
    };
  }
  
  // Add current timestamp
  validTimestamps.push(now);
  tokenCache.set(key, validTimestamps);
  
  return {
    success: true,
    limit: options.maxRequests,
    remaining: remaining - 1,
    reset,
  };
}

// Helper to apply rate limit and return error response if exceeded
export async function withRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): Promise<NextResponse | null> {
  const result = await rateLimit(request, options);
  
  if (!result.success) {
    return NextResponse.json(
      { 
        error: options.message || 'Too many requests. Please try again later.',
        retryAfter: result.reset 
      },
      { 
        status: 429,
        headers: {
          'Retry-After': result.reset.toString(),
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
        }
      }
    );
  }
  
  return null;
}
