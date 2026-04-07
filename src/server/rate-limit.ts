/**
 * Simple in-memory rate limiter for server functions.
 *
 * Limits requests per user per time window.
 * In production, replace with Redis-based limiter for multi-instance deployments.
 */

interface RateLimitEntry {
    count: number
    resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
        if (now > entry.resetAt) store.delete(key)
    }
}, 5 * 60 * 1000)

interface RateLimitOptions {
    /** Max requests per window (default: 60) */
    maxRequests?: number
    /** Window duration in ms (default: 60_000 = 1 minute) */
    windowMs?: number
}

export interface RateLimitResult {
    allowed: boolean
    remaining: number
    resetAt: number
}

/**
 * Check if a request is allowed under the rate limit.
 *
 * @param userId - Unique identifier for the user
 * @param action - Action being rate-limited (e.g., 'translate')
 */
export function checkRateLimit(
    userId: string,
    action: string,
    opts: RateLimitOptions = {},
): RateLimitResult {
    const { maxRequests = 60, windowMs = 60_000 } = opts
    const key = `${action}:${userId}`
    const now = Date.now()

    let entry = store.get(key)

    if (!entry || now > entry.resetAt) {
        entry = { count: 0, resetAt: now + windowMs }
        store.set(key, entry)
    }

    entry.count++

    return {
        allowed: entry.count <= maxRequests,
        remaining: Math.max(0, maxRequests - entry.count),
        resetAt: entry.resetAt,
    }
}

/**
 * Guard that throws if rate limit is exceeded.
 */
export function enforceRateLimit(
    userId: string,
    action: string,
    opts?: RateLimitOptions,
): void {
    const result = checkRateLimit(userId, action, opts)
    if (!result.allowed) {
        throw new Error(
            `Rate limit exceeded for ${action}. Try again in ${Math.ceil((result.resetAt - Date.now()) / 1000)}s.`,
        )
    }
}
