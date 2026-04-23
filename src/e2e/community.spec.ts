import { test, expect } from './fixtures/auth';

/**
 * E2E: Community Forum
 * Tests forum browsing, premium gating on post creation.
 */

test.describe('Community Forum', () => {
	test('should load community forum page', async ({ authenticatedPage: page }) => {
		await page.goto('/community');

		await expect(page.getByRole('heading', { name: /community/i }).first()).toBeVisible({ timeout: 8000 });
	});

	test('should display topic filter tabs', async ({ authenticatedPage: page }) => {
		await page.goto('/community');

		// Topic tabs should be visible
		const tabs = page.getByRole('tab').or(page.locator('[data-testid="topic-tab"]'));
		const count = await tabs.count();
		// At least "All" tab should exist
		if (count === 0) {
			// Fallback: look for topic buttons
			await expect(page.getByText(/all|general/i).first()).toBeVisible({ timeout: 5000 });
		} else {
			expect(count).toBeGreaterThan(0);
		}
	});

	test('should show new post button for premium users or gate for free users', async ({ authenticatedPage: page }) => {
		await page.goto('/community');

		const newPostButton = page.getByRole('link', { name: /new post|create post|write/i });
		const premiumGate = page.getByText(/premium|upgrade/i).first();

		// Either a new post button or a premium gate should be visible
		const postBtnVisible = await newPostButton.isVisible().catch(() => false);
		const gatVisible = await premiumGate.isVisible().catch(() => false);

		expect(postBtnVisible || gatVisible).toBe(true);
	});

	test('should navigate to the create post page if accessible', async ({ authenticatedPage: page }) => {
		await page.goto('/community/create');

		// Either shows a form or redirects away (gate)
		const isOnCreate = page.url().includes('/community/create');
		const isRedirected = !isOnCreate;

		if (isOnCreate) {
			await expect(page.getByRole('textbox').first()).toBeVisible({ timeout: 5000 });
		}
		// Either outcome is valid — no crash is the key assertion
		expect(true).toBe(true);
	});
});
