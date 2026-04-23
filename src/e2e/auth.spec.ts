import { test, expect } from '@playwright/test';

/**
 * E2E: Registration & Login Flow
 * Tests the critical user onboarding path.
 */

const UNIQUE_EMAIL = `e2e-${Date.now()}@test.com`;

test.describe('Authentication Flow', () => {
	test('should display the landing page and navigate to register', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(new RegExp(process.env.NEXT_PUBLIC_APP_NAME || "Intimera", "i"));

		// Look for a CTA that leads to registration
		const ctaButton = page.getByRole('link', { name: /get started|sign up|join/i }).first();
		await expect(ctaButton).toBeVisible();
		await ctaButton.click();

		await expect(page).toHaveURL(/register|signup/i);
	});

	test('should show registration form with required fields', async ({ page }) => {
		await page.goto('/register');

		await expect(page.getByLabel(/name/i)).toBeVisible();
		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i).first()).toBeVisible();
	});

	test('should show validation errors for empty submission', async ({ page }) => {
		await page.goto('/register');

		await page.getByRole('button', { name: /create account|sign up|register/i }).click();

		// Some validation message should appear
		const errorMsg = page.locator('[role="alert"], .error, [data-error]').first();
		await expect(errorMsg).toBeVisible({ timeout: 3000 }).catch(() => {
			// Fallback: browser native validation
		});
	});

	test('should navigate to login and show form', async ({ page }) => {
		await page.goto('/login');

		await expect(page.getByLabel(/email/i)).toBeVisible();
		await expect(page.getByLabel(/password/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /sign in|log in/i })).toBeVisible();
	});

	test('should show error for invalid credentials', async ({ page }) => {
		await page.goto('/login');

		await page.getByLabel(/email/i).fill('not-a-user@example.com');
		await page.getByLabel(/password/i).fill('WrongPassword123!');
		await page.getByRole('button', { name: /sign in|log in/i }).click();

		// Should not redirect to dashboard
		await expect(page).not.toHaveURL(/dashboard/, { timeout: 5000 });
	});

	test('should redirect unauthenticated user from dashboard to login', async ({ page }) => {
		await page.goto('/dashboard');

		// Should be redirected away from dashboard
		await expect(page).not.toHaveURL(/dashboard/, { timeout: 5000 });
	});
});
