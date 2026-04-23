"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";
import { getConsent } from "@/lib/analytics/consent";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let initialized = false;

/**
 * Initializes PostHog only when the user has granted analytics consent.
 * Safe to call multiple times — will no-op if already initialized.
 */
export function initPostHog() {
	if (!POSTHOG_KEY || typeof window === "undefined" || initialized) return;

	const consent = getConsent();
	if (consent !== "granted") return;

	posthog.init(POSTHOG_KEY, {
		api_host: POSTHOG_HOST,
		// Privacy-first defaults
		capture_pageview: false,        // We'll capture manually via usePostHogPageView
		capture_pageleave: true,
		disable_session_recording: true, // Enable only if explicitly needed
		persistence: "localStorage",
		opt_out_capturing_by_default: false,
		// Respect user's consent — don't fingerprint
		autocapture: false,
	});

	initialized = true;
}

/** Tracks a PostHog event if analytics are initialized and consented. */
export function track(event: string, properties?: Record<string, unknown>) {
	if (initialized && typeof window !== "undefined") {
		posthog.capture(event, properties);
	}
}

/** Identifies the current user in PostHog. */
export function identify(userId: string, properties?: Record<string, unknown>) {
	if (initialized && typeof window !== "undefined") {
		posthog.identify(userId, properties);
	}
}

/** Resets the PostHog session (on sign-out). */
export function resetAnalytics() {
	if (initialized && typeof window !== "undefined") {
		posthog.reset();
	}
}

// ─── PostHog React Provider ───────────────────────────────────────────────────

interface PostHogProviderProps {
	children: ReactNode;
}

export function PostHogProvider({ children }: PostHogProviderProps) {
	useEffect(() => {
		// Attempt initialization on mount — will succeed only if consent was previously granted
		initPostHog();
	}, []);

	if (!POSTHOG_KEY) {
		// No PostHog key — render children without provider
		return <>{children}</>;
	}

	return <PHProvider client={posthog}>{children}</PHProvider>;
}
