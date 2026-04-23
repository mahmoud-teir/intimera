import { test as base, Page, expect } from '@playwright/test';

/**
 * Shared test fixture that provides an authenticated page.
 * Uses env vars for test credentials so they never live in source code.
 */
type AuthFixtures = {
	authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
	authenticatedPage: async ({ page }, use) => {
		const email = process.env.E2E_TEST_EMAIL || 'e2e-test@example.com';
		const password = process.env.E2E_TEST_PASSWORD || 'TestPass123!';

		// Navigate to login and authenticate
		await page.goto('/login');
		await page.getByLabel(/email/i).fill(email);
		await page.getByLabel(/password/i).fill(password);
		await page.getByRole('button', { name: /sign in|log in/i }).click();

		// Wait for redirect to dashboard
		await page.waitForURL('**/dashboard', { timeout: 10_000 });

		// Store auth state for subsequent requests within this test
		await use(page);
	},
});

export { expect };
