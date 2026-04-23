import { vi } from "vitest";

/**
 * Creates a mock Better Auth session for use in server action or component tests.
 * Use it to stub out auth.api.getSession().
 */
export function createMockSession(overrides = {}) {
	return {
		user: {
			id: "test-user-id",
			email: "test@example.com",
			name: "Test User",
			role: "USER",
			...overrides
		},
		session: {
			id: "test-session-id",
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
		}
	};
}

/**
 * Helper to mock the actual auth module in tests.
 * Usage:
 * vi.mock("@/lib/auth", () => mockAuthModule(createMockSession()));
 */
export function mockAuthModule(mockSession: any = null) {
	return {
		auth: {
			api: {
				getSession: vi.fn().mockResolvedValue(mockSession),
			}
		}
	};
}
