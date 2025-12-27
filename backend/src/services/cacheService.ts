/**
 * Cache Service - Redis Integration
 * 
 * Provides caching layer for:
 * - Search query results
 * - Hot verse lookups
 * - Lexicon entries
 */

import Redis from 'ioredis';

// Redis Client Singleton
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
    if (!redis) {
        redis = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });

        redis.on('error', (error) => {
            console.error('Redis connection error:', error);
        });

        redis.on('connect', () => {
            console.log('📦 Redis connected');
        });
    }
    return redis;
}

// ============================================
// CACHE KEYS
// ============================================

const CACHE_KEYS = {
    SEARCH: (query: string, filters: string) => `search:${query}:${filters}`,
    VERSE: (bookId: number, chapter: number, verse: number) => `verse:${bookId}:${chapter}:${verse}`,
    CHAPTER: (bookId: number, chapter: number) => `chapter:${bookId}:${chapter}`,
    LEXICON: (strongNumber: string) => `lexicon:${strongNumber}`,
    STRONGS_SEARCH: (query: string) => `strongs:search:${query}`,
};

// Cache TTL in seconds
const TTL = {
    SEARCH: 300,      // 5 minutes
    VERSE: 3600,      // 1 hour
    CHAPTER: 3600,    // 1 hour
    LEXICON: 86400,   // 24 hours (rarely changes)
};

// ============================================
// CACHE OPERATIONS
// ============================================

export async function getCached<T>(key: string): Promise<T | null> {
    try {
        const client = getRedisClient();
        const data = await client.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Cache get error:', error);
        return null;
    }
}

export async function setCache(key: string, data: any, ttl: number): Promise<void> {
    try {
        const client = getRedisClient();
        await client.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
        console.error('Cache set error:', error);
    }
}

export async function invalidateCache(pattern: string): Promise<void> {
    try {
        const client = getRedisClient();
        const keys = await client.keys(pattern);
        if (keys.length > 0) {
            await client.del(...keys);
        }
    } catch (error) {
        console.error('Cache invalidation error:', error);
    }
}

// ============================================
// SPECIALIZED CACHE FUNCTIONS
// ============================================

export async function getCachedSearch(query: string, filters: Record<string, any>): Promise<any | null> {
    const key = CACHE_KEYS.SEARCH(query.toLowerCase(), JSON.stringify(filters));
    return getCached(key);
}

export async function setCachedSearch(query: string, filters: Record<string, any>, results: any): Promise<void> {
    const key = CACHE_KEYS.SEARCH(query.toLowerCase(), JSON.stringify(filters));
    await setCache(key, results, TTL.SEARCH);
}

export async function getCachedVerse(bookId: number, chapter: number, verse: number): Promise<any | null> {
    const key = CACHE_KEYS.VERSE(bookId, chapter, verse);
    return getCached(key);
}

export async function setCachedVerse(bookId: number, chapter: number, verse: number, data: any): Promise<void> {
    const key = CACHE_KEYS.VERSE(bookId, chapter, verse);
    await setCache(key, data, TTL.VERSE);
}

export async function getCachedChapter(bookId: number, chapter: number): Promise<any | null> {
    const key = CACHE_KEYS.CHAPTER(bookId, chapter);
    return getCached(key);
}

export async function setCachedChapter(bookId: number, chapter: number, data: any): Promise<void> {
    const key = CACHE_KEYS.CHAPTER(bookId, chapter);
    await setCache(key, data, TTL.CHAPTER);
}

export async function getCachedLexicon(strongNumber: string): Promise<any | null> {
    const key = CACHE_KEYS.LEXICON(strongNumber.toUpperCase());
    return getCached(key);
}

export async function setCachedLexicon(strongNumber: string, data: any): Promise<void> {
    const key = CACHE_KEYS.LEXICON(strongNumber.toUpperCase());
    await setCache(key, data, TTL.LEXICON);
}

// ============================================
// HEALTH CHECK
// ============================================

export async function checkRedisHealth(): Promise<boolean> {
    try {
        const client = getRedisClient();
        await client.ping();
        return true;
    } catch (error) {
        console.error('Redis health check failed:', error);
        return false;
    }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

export async function disconnectRedis(): Promise<void> {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}
