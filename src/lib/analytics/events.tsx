"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { usePostHog } from "posthog-js/react";
import { getConsent } from "@/lib/analytics/consent";

// ─── Page view tracking ───────────────────────────────────────────────────────

function PageViewTrackerInner() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthog = usePostHog();

	useEffect(() => {
		if (!posthog || getConsent() !== "granted") return;

		const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
		posthog.capture("$pageview", { $current_url: url });
	}, [pathname, searchParams, posthog]);

	return null;
}

/** Wrap in Suspense because useSearchParams() requires it in App Router. */
export function PostHogPageView() {
	return (
		<Suspense fallback={null}>
			<PageViewTrackerInner />
		</Suspense>
	);
}

// ─── Typed event catalogue ────────────────────────────────────────────────────
// Central place to define all event names — prevents typos across the codebase.

export const AnalyticsEvents = {
	// Content
	CONTENT_VIEW: "content_view",
	CONTENT_BOOKMARKED: "content_bookmarked",
	CONTENT_SEARCH: "content_search",

	// Exercises
	EXERCISE_STARTED: "exercise_started",
	EXERCISE_COMPLETED: "exercise_completed",
	EXERCISE_ABANDONED: "exercise_abandoned",

	// AI Advisor
	ADVISOR_SESSION_STARTED: "advisor_session_started",
	ADVISOR_MESSAGE_SENT: "advisor_message_sent",
	ADVISOR_LIMIT_HIT: "advisor_limit_hit",

	// Community
	COMMUNITY_POST_CREATED: "community_post_created",
	COMMUNITY_POST_VOTED: "community_post_voted",
	COMMUNITY_REPLY_CREATED: "community_reply_created",

	// Check-in
	CHECK_IN_COMPLETED: "check_in_completed",

	// Couple
	COUPLE_INVITE_SENT: "couple_invite_sent",
	COUPLE_LINKED: "couple_linked",
	SHARED_NOTE_CREATED: "shared_note_created",

	// Subscription
	SUBSCRIPTION_UPGRADE_CLICKED: "subscription_upgrade_clicked",
	SUBSCRIPTION_CHECKOUT_STARTED: "subscription_checkout_started",
	SUBSCRIPTION_COMPLETED: "subscription_completed",

	// Auth
	SIGN_UP_COMPLETED: "sign_up_completed",
	SIGN_IN_COMPLETED: "sign_in_completed",
} as const;

export type AnalyticsEvent = typeof AnalyticsEvents[keyof typeof AnalyticsEvents];
