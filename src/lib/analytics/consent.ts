/**
 * Consent status is stored in localStorage under this key.
 * Values: 'granted' | 'denied' | undefined (not yet asked)
 */
export const CONSENT_KEY = "intimera_analytics_consent";

export type ConsentStatus = "granted" | "denied" | "pending";

export function getConsent(): ConsentStatus {
	if (typeof window === "undefined") return "pending";
	const value = localStorage.getItem(CONSENT_KEY);
	if (value === "granted") return "granted";
	if (value === "denied") return "denied";
	return "pending";
}

export function setConsent(status: "granted" | "denied"): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(CONSENT_KEY, status);
	// Also set a cookie so server-side middleware can read it
	const maxAge = 365 * 24 * 60 * 60;
	document.cookie = `${CONSENT_KEY}=${status}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
