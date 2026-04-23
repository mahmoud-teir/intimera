import { PrismaClient } from '@/generated/prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

// Create a deep mock of the PrismaClient
export const mockDb = mockDeep<PrismaClient>();

// Ensure that before each test, the mock is reset
beforeEach(() => {
	mockReset(mockDb);
});

// Since the application imports db from '@/lib/db', we'll use vitest to alias it
// Usage in a test file:
// vi.mock('@/lib/db', () => ({ db: mockDb }));
