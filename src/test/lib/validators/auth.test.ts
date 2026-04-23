import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '@/lib/validators/auth';

describe('Auth Validators', () => {
	describe('registerSchema', () => {
		it('should validate valid data successfully', () => {
			const validData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123!',
				ageVerification: true
			};

			const result = registerSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should fail if age verification is false', () => {
			const invalidData = {
				name: 'Test User',
				email: 'test@example.com',
				password: 'Password123!',
				ageVerification: false
			};

			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it('should fail if email is invalid', () => {
			const invalidData = {
				name: 'Test User',
				email: 'not-an-email',
				password: 'Password123!',
				ageVerification: true
			};

			const result = registerSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe('loginSchema', () => {
		it('should validate valid data successfully', () => {
			const validData = {
				email: 'test@example.com',
				password: 'Password123!'
			};

			const result = loginSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it('should fail if email is empty', () => {
			const invalidData = {
				email: '',
				password: 'Password123!'
			};

			const result = loginSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});
