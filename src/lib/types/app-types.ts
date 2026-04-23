/**
 * Client-safe plain-TS type aliases that mirror Prisma entity shapes.
 *
 * Use these in "use client" components instead of importing from
 * @/generated/prisma/client — the Prisma runtime contains node:module
 * references that cannot be bundled for the browser.
 *
 * Server components and API routes should continue using Prisma types directly.
 */

// ─── Enums (must match prisma/schema.prisma exactly) ─────────────────────────

export type SubscriptionTier = "FREE" | "PREMIUM" | "COUPLES";
export type RelationshipStage = "ANY" | "NEW" | "ESTABLISHED" | "LONG_TERM";
export type ExerciseType = "REFLECTION" | "ACTIVITY" | "COMMUNICATION" | "INTIMACY";
export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type Role = "USER" | "PREMIUM" | "COUPLES" | "ADMIN";
export type StepType = "TEXT_PROMPT" | "TEXT_INPUT" | "MULTIPLE_CHOICE" | "SCALE_SLIDER" | "REFLECTION";
export type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

// ─── Entity Shapes (field names mirror generated Prisma types) ────────────────

/** Mirrors the ExerciseStep Prisma model */
export interface AppExerciseStep {
	id: string;
	exerciseId: string;
	stepNumber: number;
	locale: string;
	title: string;
	instruction: string;
	type: StepType;
	options?: string | null; // JSON string for MULTIPLE_CHOICE
	createdAt?: Date | string;
}

/** Mirrors the Exercise Prisma model with optional joined steps */
export interface AppExercise {
	id: string;
	slug: string;
	type: ExerciseType;
	tier: SubscriptionTier;
	difficulty?: Difficulty;
	relationshipStage?: RelationshipStage;
	estimatedTimeMin?: number;
	status?: ContentStatus;
	steps?: AppExerciseStep[];
}

/** Mirrors the CommunityTopic Prisma model */
export interface AppCommunityTopic {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	_count?: { posts: number };
}

/** Mirrors SharedNote — note: server decrypts before passing to client */
export interface AppSharedNote {
	id: string;
	coupleId: string;
	encryptedContent: string; // server decrypts before sending; field kept for type compat
	createdAt: Date | string;
	updatedAt: Date | string;
}

/** Minimal user shape safe for client components */
export interface AppUser {
	id: string;
	name?: string | null;
	email: string;
	image?: string | null;
	role: Role;
}
