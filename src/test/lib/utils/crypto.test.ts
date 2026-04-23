import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We need to control the ENCRYPTION_KEY env var for testing
const TEST_KEY = 'a'.repeat(64); // 64 hex chars = 32 bytes

describe('Crypto Utility', () => {
	beforeEach(() => {
		vi.stubEnv('ENCRYPTION_KEY', TEST_KEY);
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	// We import after stubbing the env so the key is available
	describe('encrypt() & decrypt()', async () => {
		const { encrypt, decrypt } = await import('@/lib/utils/crypto');

		it('should encrypt a string and return a colon-delimited hex string', () => {
			const result = encrypt('hello world');
			expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/);
		});

		it('should decrypt back to the original plaintext', () => {
			const original = 'My secret relationship note';
			const encrypted = encrypt(original);
			const decrypted = decrypt(encrypted);
			expect(decrypted).toBe(original);
		});

		it('should produce different ciphertext for the same plaintext (due to random IV)', () => {
			const plaintext = 'same input';
			const enc1 = encrypt(plaintext);
			const enc2 = encrypt(plaintext);
			// Different ciphertexts due to random IV
			expect(enc1).not.toBe(enc2);
			// But both should decrypt correctly
			expect(decrypt(enc1)).toBe(plaintext);
			expect(decrypt(enc2)).toBe(plaintext);
		});

		it('should handle unicode / emoji content', () => {
			const original = '❤️ I love you, mija 🌹';
			expect(decrypt(encrypt(original))).toBe(original);
		});

		it('should handle long text content', () => {
			const original = 'A'.repeat(5000);
			expect(decrypt(encrypt(original))).toBe(original);
		});

		it('should throw for tampered ciphertext', () => {
			const encrypted = encrypt('sensitive data');
			// Corrupt the last byte of the ciphertext part
			const parts = encrypted.split(':');
			parts[2] = parts[2].slice(0, -2) + 'ff'; // Change last hex byte
			const tampered = parts.join(':');
			expect(() => decrypt(tampered)).toThrow();
		});

		it('should throw for malformed encrypted value', () => {
			expect(() => decrypt('not-valid-format')).toThrow('Invalid encrypted value format');
		});
	});

	describe('encryptOrNull() & decryptOrNull()', async () => {
		const { encryptOrNull, decryptOrNull } = await import('@/lib/utils/crypto');

		it('should return null for null input', () => {
			expect(encryptOrNull(null)).toBeNull();
			expect(decryptOrNull(null)).toBeNull();
		});

		it('should return null for undefined input', () => {
			expect(encryptOrNull(undefined)).toBeNull();
			expect(decryptOrNull(undefined)).toBeNull();
		});

		it('should encrypt non-null values', () => {
			const result = encryptOrNull('secret');
			expect(result).not.toBeNull();
			expect(result).toMatch(/^[0-9a-f]+:[0-9a-f]+:[0-9a-f]+$/);
		});

		it('should decrypt non-null values', () => {
			const encrypted = encryptOrNull('my note');
			expect(decryptOrNull(encrypted)).toBe('my note');
		});
	});

	describe('Key validation', async () => {
		it('should throw if ENCRYPTION_KEY is missing', async () => {
			vi.stubEnv('ENCRYPTION_KEY', '');
			const { encrypt } = await import('@/lib/utils/crypto');
			expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY');
		});

		it('should throw if ENCRYPTION_KEY is wrong length', async () => {
			vi.stubEnv('ENCRYPTION_KEY', 'tooshort');
			const { encrypt } = await import('@/lib/utils/crypto');
			expect(() => encrypt('test')).toThrow();
		});
	});
});
