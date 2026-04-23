/**
 * Encryption Utility — AES-256-GCM
 *
 * Provides symmetric encryption for sensitive user data at rest:
 * - AI conversation messages
 * - Shared couple notes
 * - Check-in personal notes
 *
 * Algorithm: AES-256-GCM (authenticated encryption — provides both
 * confidentiality and integrity/tamper-detection).
 *
 * Each encrypted value is stored as a single string in the format:
 *   <iv_hex>:<authTag_hex>:<ciphertext_hex>
 *
 * Key derivation: raw 32-byte key from the ENCRYPTION_KEY env var (hex).
 * Generate a key: `openssl rand -hex 32`
 */

import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag

/**
 * Returns the encryption key as a Buffer.
 * Throws clearly if the env var is missing or malformed.
 */
function getKey(): Buffer {
	const raw = process.env.ENCRYPTION_KEY;
	if (!raw) {
		throw new Error(
			"Missing ENCRYPTION_KEY environment variable. " +
			"Generate one with: openssl rand -hex 32"
		);
	}
	const key = Buffer.from(raw, "hex");
	if (key.length !== 32) {
		throw new Error(
			`ENCRYPTION_KEY must be exactly 32 bytes (64 hex chars). Got ${key.length} bytes.`
		);
	}
	return key;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns an opaque string safe to store in the database.
 *
 * @param plaintext - The raw string to encrypt.
 * @returns A colon-delimited string: `<iv>:<authTag>:<ciphertext>` (all hex).
 */
export function encrypt(plaintext: string): string {
	const key = getKey();
	const iv = randomBytes(IV_LENGTH);
	const cipher = createCipheriv(ALGORITHM, key, iv);

	const encrypted = Buffer.concat([
		cipher.update(plaintext, "utf8"),
		cipher.final(),
	]);

	const authTag = cipher.getAuthTag();

	return [
		iv.toString("hex"),
		authTag.toString("hex"),
		encrypted.toString("hex"),
	].join(":");
}

/**
 * Decrypts a value produced by `encrypt()`.
 *
 * @param encryptedValue - The colon-delimited encrypted string from the database.
 * @returns The original plaintext string.
 * @throws If the value is tampered with, malformed, or the key is wrong.
 */
export function decrypt(encryptedValue: string): string {
	const key = getKey();
	const parts = encryptedValue.split(":");

	if (parts.length !== 3) {
		throw new Error("Invalid encrypted value format. Expected: iv:authTag:ciphertext");
	}

	const [ivHex, authTagHex, ciphertextHex] = parts;
	const iv = Buffer.from(ivHex, "hex");
	const authTag = Buffer.from(authTagHex, "hex");
	const ciphertext = Buffer.from(ciphertextHex, "hex");

	const decipher = createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(authTag);

	const decrypted = Buffer.concat([
		decipher.update(ciphertext),
		decipher.final(),
	]);

	return decrypted.toString("utf8");
}

/**
 * Safely decrypt a nullable field, returning null if the value is null/undefined.
 * Useful for optional encrypted fields like CheckIn.encryptedNotes.
 */
export function decryptOrNull(encryptedValue: string | null | undefined): string | null {
	if (encryptedValue == null) return null;
	return decrypt(encryptedValue);
}

/**
 * Encrypt a nullable value, returning null if the input is null/undefined.
 * Useful for optional fields.
 */
export function encryptOrNull(plaintext: string | null | undefined): string | null {
	if (plaintext == null) return null;
	return encrypt(plaintext);
}
