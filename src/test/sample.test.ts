import { describe, it, expect, vi } from 'vitest';
import { mockDb } from '@/lib/__mocks__/db';
import { createMockSession } from './utils';

// We mock the actual DB to point to our mockDb instance
vi.mock('@/lib/db', () => ({
	db: mockDb
}));

describe('Test Infrastructure Validation', () => {
	it('should verify that math works', () => {
		expect(1 + 1).toBe(2);
	});

	it('should verify that the DB mock works', async () => {
		// Setup the mock response
		mockDb.user.findUnique.mockResolvedValue({
			id: '123',
			email: 'test@test.com',
			name: 'Test',
			emailVerified: true,
			image: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			stripeCustomerId: null,
			role: 'USER' as any,
			locale: 'en'
		});

		// Import the mocked db inside the test to use it
		const { db } = await import('@/lib/db');
		
		const result = await db.user.findUnique({ where: { id: '123' } });
		
		expect(result).toBeDefined();
		expect(result?.email).toBe('test@test.com');
		expect(mockDb.user.findUnique).toHaveBeenCalledTimes(1);
	});

	it('should verify that the session mocker works', () => {
		const session = createMockSession({ role: 'PREMIUM' });
		expect(session.user.role).toBe('PREMIUM');
	});
});
