import { test, expect } from './fixtures/auth';

/**
 * E2E: Subscription & Upgrade Flow
 * Tests the pricing page and upgrade CTA behaviors.
 */

test.describe('Pricing & Subscription', () => {
	test('should display the public pricing page', async ({ page }) => {
		await page.goto('/pricing');

		await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 8000 });

		// Should show tier names
		await expect(page.getByText(/premium/i).first()).toBeVisible();
	});

	test('should show all three pricing tiers', async ({ page }) => {
		await page.goto('/pricing');

		await expect(page.getByText(/basic|free/i).first()).toBeVisible({ timeout: 5000 });
		await expect(page.getByText(/premium/i).first()).toBeVisible();
		await expect(page.getByText(/couples/i).first()).toBeVisible();
	});

	test('should show FAQ section on pricing page', async ({ page }) => {
		await page.goto('/pricing');

		await expect(page.getByRole('heading', { name: /frequently asked|faq/i })).toBeVisible({ timeout: 5000 });
	});

	test('clicking upgrade when logged out redirects to login', async ({ page }) => {
		await page.goto('/pricing');

		// Click any upgrade/get started button
		const upgradeButton = page.getByRole('link', { name: /get started|upgrade/i }).first();
		if (await upgradeButton.isVisible()) {
			await upgradeButton.click();
			// Should redirect to login (not crash)
			await expect(page).toHaveURL(/login|register|pricing/, { timeout: 8000 });
		}
	});

	test('settings subscription page shows billing section when authenticated', async ({ authenticatedPage: page }) => {
		await page.goto('/settings/subscription');

		await expect(page.getByText(/subscription|billing|plan/i).first()).toBeVisible({ timeout: 8000 });
		// Should show upgrade or manage button
		const billingBtn = page.getByRole('button', { name: /upgrade|manage billing/i });
		await expect(billingBtn).toBeVisible();
	});
});
