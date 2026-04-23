import { describe, it, expect, beforeEach, vi } from 'vitest';

// We need a fresh store for each test — reset by reimporting with module cache cleared
// Since the store is module-level, we test behavior by using unique keys per test

let rateLimit: typeof import('@/lib/utils/rate-limit').rateLimit;
let rateLimitResponse: typeof import('@/lib/utils/rate-limit').rateLimitResponse;
let getClientIp: typeof import('@/lib/utils/rate-limit').getClientIp;

beforeEach(async () => {
	// Re-import to get the actual module (store persists but we use unique keys)
	const mod = await import('@/lib/utils/rate-limit');
	rateLimit = mod.rateLimit;
	rateLimitResponse = mod.rateLimitResponse;
	getClientIp = mod.getClientIp;
});

describe('Rate Limiter', () => {
	describe('rateLimit()', () => {
		it('should allow the first request', async () => {
			const key = `test:allow-first:${Date.now()}`;
			const result = await rateLimit(key, { limit: 5, window: 60 });

			expect(result.success).toBe(true);
			expect(result.limit).toBe(5);
			expect(result.remaining).toBe(4);
		});

		it('should decrement remaining on each request', async () => {
			const key = `test:decrement:${Date.now()}`;
			await rateLimit(key, { limit: 3, window: 60 });
			await rateLimit(key, { limit: 3, window: 60 });
			const result = await rateLimit(key, { limit: 3, window: 60 });

			expect(result.remaining).toBe(0);
		});

		it('should block requests beyond the limit', async () => {
			const key = `test:block:${Date.now()}`;
			await rateLimit(key, { limit: 2, window: 60 });
			await rateLimit(key, { limit: 2, window: 60 });
			// Third request should be blocked
			const result = await rateLimit(key, { limit: 2, window: 60 });

			expect(result.success).toBe(false);
			expect(result.remaining).toBe(0);
		});

		it('should return a reset timestamp in the future', async () => {
			const key = `test:reset:${Date.now()}`;
			const now = Math.ceil(Date.now() / 1000);
			const result = await rateLimit(key, { limit: 5, window: 60 });

			expect(result.reset).toBeGreaterThan(now);
			expect(result.reset).toBeLessThanOrEqual(now + 61);
		});

		it('should use separate counts for different keys', async () => {
			const ts = Date.now();
			await rateLimit(`test:sep:a:${ts}`, { limit: 1, window: 60 });
			// Exhaust key A
			await rateLimit(`test:sep:a:${ts}`, { limit: 1, window: 60 });
			// Key B should still have remaining
			const resultB = await rateLimit(`test:sep:b:${ts}`, { limit: 1, window: 60 });

			expect(resultB.success).toBe(true);
		});
	});

	describe('rateLimitResponse()', () => {
		it('should return a 429 response', () => {
			const reset = Math.ceil(Date.now() / 1000) + 60;
			const response = rateLimitResponse(reset);

			expect(response.status).toBe(429);
		});

		it('should include Retry-After header', () => {
			const reset = Math.ceil(Date.now() / 1000) + 120;
			const response = rateLimitResponse(reset);

			const retryAfter = response.headers.get('Retry-After');
			expect(retryAfter).not.toBeNull();
			expect(Number(retryAfter)).toBeGreaterThan(0);
		});

		it('should include X-RateLimit-Reset header', () => {
			const reset = Math.ceil(Date.now() / 1000) + 60;
			const response = rateLimitResponse(reset);

			expect(response.headers.get('X-RateLimit-Reset')).toBe(String(reset));
		});
	});

	describe('getClientIp()', () => {
		it('should extract IP from x-forwarded-for header', () => {
			const req = new Request('http://localhost/', {
				headers: { 'x-forwarded-for': '203.0.113.42, 10.0.0.1' }
			});
			expect(getClientIp(req)).toBe('203.0.113.42');
		});

		it('should fall back to x-real-ip', () => {
			const req = new Request('http://localhost/', {
				headers: { 'x-real-ip': '192.0.2.1' }
			});
			expect(getClientIp(req)).toBe('192.0.2.1');
		});

		it('should fall back to 127.0.0.1 if no headers present', () => {
			const req = new Request('http://localhost/');
			expect(getClientIp(req)).toBe('127.0.0.1');
		});
	});
});
