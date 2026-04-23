/**
 * Rate Limiting Utility
 *
 * Implements a sliding window rate limiter.
 * Uses an in-memory store for development/edge compatibility.
 * Swap the `store` for a Redis/Upstash KV store in production for
 * persistence across serverless function invocations.
 *
 * Usage:
 *   const { success, limit, remaining, reset } = await rateLimit(key, { limit: 5, window: 60 });
 *   if (!success) return rateLimitResponse(reset);
 */

interface RateLimitEntry {
	count: number;
	resetAt: number; // Unix timestamp in ms
}

// In-memory store — works across requests in dev / single-process environments.
// In production, replace with a Redis client for cross-instance persistence.
const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory leaks.
if (typeof setInterval !== "undefined") {
	setInterval(() => {
		const now = Date.now();
		for (const [key, entry] of store.entries()) {
			if (entry.resetAt <= now) store.delete(key);
		}
	}, 5 * 60 * 1000);
}

export interface RateLimitOptions {
	/** Maximum number of requests allowed within the window */
	limit: number;
	/** Window size in seconds */
	window: number;
}

export interface RateLimitResult {
	success: boolean;
	limit: number;
	remaining: number;
	/** Unix timestamp (seconds) at which the window resets */
	reset: number;
}

/**
 * Check and increment the rate limit counter for a given key.
 */
export async function rateLimit(
	key: string,
	options: RateLimitOptions
): Promise<RateLimitResult> {
	const now = Date.now();
	const windowMs = options.window * 1000;

	const entry = store.get(key);

	// Window has expired — start a fresh window
	if (!entry || entry.resetAt <= now) {
		const newEntry: RateLimitEntry = {
			count: 1,
			resetAt: now + windowMs,
		};
		store.set(key, newEntry);
		return {
			success: true,
			limit: options.limit,
			remaining: options.limit - 1,
			reset: Math.ceil(newEntry.resetAt / 1000),
		};
	}

	// Within the current window
	const remaining = options.limit - entry.count;

	if (remaining <= 0) {
		return {
			success: false,
			limit: options.limit,
			remaining: 0,
			reset: Math.ceil(entry.resetAt / 1000),
		};
	}

	// Increment counter
	entry.count += 1;
	store.set(key, entry);

	return {
		success: true,
		limit: options.limit,
		remaining: remaining - 1,
		reset: Math.ceil(entry.resetAt / 1000),
	};
}

/**
 * Pre-configured rate limiters for different use cases.
 */
export const Limiters = {
	/** AI Advisor — 5 requests/day for free tier, effectively unlimited for premium */
	advisorFree: (userId: string) =>
		rateLimit(`advisor:free:${userId}`, { limit: 5, window: 86400 }),

	advisorPremium: (userId: string) =>
		rateLimit(`advisor:premium:${userId}`, { limit: 500, window: 86400 }),

	/** Auth — 5 attempts per 15 minutes per IP */
	auth: (ip: string) =>
		rateLimit(`auth:${ip}`, { limit: 5, window: 15 * 60 }),

	/** Community posting — 10 posts per hour per user */
	communityPost: (userId: string) =>
		rateLimit(`community:post:${userId}`, { limit: 10, window: 3600 }),

	/** API general — 100 requests per minute per IP */
	api: (ip: string) =>
		rateLimit(`api:${ip}`, { limit: 100, window: 60 }),
} as const;

/**
 * Creates a standard 429 Too Many Requests response with Retry-After header.
 */
export function rateLimitResponse(resetTimestamp: number): Response {
	const now = Math.ceil(Date.now() / 1000);
	const retryAfter = Math.max(0, resetTimestamp - now);

	return new Response(
		JSON.stringify({
			error: "Too Many Requests",
			message: "You have exceeded the rate limit. Please try again later.",
			retryAfter,
		}),
		{
			status: 429,
			headers: {
				"Content-Type": "application/json",
				"Retry-After": String(retryAfter),
				"X-RateLimit-Reset": String(resetTimestamp),
			},
		}
	);
}

/**
 * Helper to extract the client IP from a Next.js Request object.
 */
export function getClientIp(req: Request): string {
	return (
		req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		req.headers.get("x-real-ip") ||
		"127.0.0.1"
	);
}
