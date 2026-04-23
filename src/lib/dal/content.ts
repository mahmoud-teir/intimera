import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { RelationshipStage, SubscriptionTier, ContentStatus } from "@/generated/prisma/client";

// Re-export types for convenience
export { RelationshipStage, SubscriptionTier };

// ─── Cache Tags ───────────────────────────────────────────────────────────────
// Structured tag names for targeted revalidation via revalidateTag()
export const CACHE_TAGS = {
	content: "content",
	contentSlug: (slug: string) => `content:${slug}`,
	contentCategory: (slug: string) => `content:category:${slug}`,
	featured: "content:featured",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ContentWithTranslation = {
	id: string;
	slug: string;
	tier: SubscriptionTier;
	difficulty: string;
	readingTimeMin: number;
	publishedAt: Date | null;
	category: {
		id: string;
		name: string;
		slug: string;
		icon: string | null;
	};
	translation: {
		title: string;
		summary: string;
		body?: string; // Optional because it might be stripped
	} | null;
	isLocked: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalizes the raw Prisma result to enforce the paywall if needed.
 */
function normalizeContent(content: any, userTier: SubscriptionTier): ContentWithTranslation {
	const translation = content.translations[0] || null;
	const isLocked = content.tier === SubscriptionTier.PREMIUM && userTier === SubscriptionTier.FREE;

	let normalizedTranslation = null;
	if (translation) {
		normalizedTranslation = {
			title: translation.title,
			summary: translation.summary,
			// Strip body if locked
			body: isLocked ? undefined : translation.body,
		};
	}

	return {
		id: content.id,
		slug: content.slug,
		tier: content.tier,
		difficulty: content.difficulty,
		readingTimeMin: content.readingTimeMin,
		publishedAt: content.publishedAt,
		category: {
			id: content.category.id,
			name: content.category.name,
			slug: content.category.slug,
			icon: content.category.icon,
		},
		translation: normalizedTranslation,
		isLocked,
	};
}

// ─── Cached Queries ───────────────────────────────────────────────────────────
//
// Two-layer caching strategy:
//   1. `unstable_cache` — cross-request / cross-user caching in Next.js data cache.
//      Content is revalidated via `revalidateTag()` when admins publish/update.
//   2. `cache` (React) — per-request deduplication so the same query called
//      multiple times in one render cycle only hits the DB once.
//
// Note: The paywall normalisation is applied AFTER fetching the cached raw data,
// so different tiers can share the same cached DB result.

const CONTENT_TTL = 3600; // 1 hour default TTL

/**
 * Fetches a single content piece by slug and locale.
 * Cached per slug for 1 hour; revalidated by content slug tag.
 */
const _getContentBySlug = unstable_cache(
	async (slug: string, locale: string) => {
		const content = await db.content.findUnique({
			where: { slug },
			include: {
				category: true,
				translations: {
					where: { locale },
					take: 1,
				},
			},
		});
		if (!content || content.status !== ContentStatus.PUBLISHED) return null;
		return content;
	},
	["content-by-slug"],
	{ revalidate: CONTENT_TTL, tags: [CACHE_TAGS.content] }
);

export const getContentBySlug = cache(async (
	slug: string, 
	locale: string, 
	userTier: SubscriptionTier = SubscriptionTier.FREE
) => {
	const content = await _getContentBySlug(slug, locale);
	if (!content) return null;
	return normalizeContent(content, userTier);
});

/**
 * Fetches published content belonging to a specific category.
 * Cached per category slug for 1 hour.
 */
const _listContentByCategory = unstable_cache(
	async (categorySlug: string, locale: string, limit: number, skip: number) => {
		return db.content.findMany({
			where: {
				status: ContentStatus.PUBLISHED,
				category: { slug: categorySlug }
			},
			include: {
				category: true,
				translations: {
					where: { locale },
					take: 1,
				},
			},
			orderBy: { sortOrder: 'desc' },
			take: limit,
			skip,
		});
	},
	["content-by-category"],
	{ revalidate: CONTENT_TTL, tags: [CACHE_TAGS.content] }
);

export const listContentByCategory = cache(async (
	categorySlug: string, 
	locale: string, 
	userTier: SubscriptionTier = SubscriptionTier.FREE,
	limit = 10,
	skip = 0
) => {
	const items = await _listContentByCategory(categorySlug, locale, limit, skip);
	return items.map(item => normalizeContent(item, userTier));
});

/**
 * Fetches content recommended for a specific relationship stage.
 * Cached globally for 1 hour.
 */
const _listContentByStage = unstable_cache(
	async (stage: RelationshipStage, locale: string, limit: number) => {
		return db.content.findMany({
			where: {
				status: ContentStatus.PUBLISHED,
				OR: [
					{ relationshipStage: stage },
					{ relationshipStage: RelationshipStage.ANY }
				]
			},
			include: {
				category: true,
				translations: {
					where: { locale },
					take: 1,
				},
			},
			orderBy: { publishedAt: 'desc' },
			take: limit,
		});
	},
	["content-by-stage"],
	{ revalidate: CONTENT_TTL, tags: [CACHE_TAGS.content] }
);

export const listContentByStage = cache(async (
	stage: RelationshipStage, 
	locale: string, 
	userTier: SubscriptionTier = SubscriptionTier.FREE,
	limit = 10
) => {
	const items = await _listContentByStage(stage, locale, limit);
	return items.map(item => normalizeContent(item, userTier));
});

/**
 * Searches content by title or summary within a specific locale.
 * Short TTL (5 min) for search results since they're highly dynamic.
 */
export const searchContent = cache(async (
	query: string, 
	locale: string, 
	userTier: SubscriptionTier = SubscriptionTier.FREE,
	limit = 10
) => {
	// Search queries are NOT cached with unstable_cache since they're highly variable
	// React cache() still deduplicates within a single request
	const items = await db.content.findMany({
		where: {
			status: ContentStatus.PUBLISHED,
			translations: {
				some: {
					locale,
					OR: [
						{ title: { contains: query, mode: 'insensitive' } },
						{ summary: { contains: query, mode: 'insensitive' } }
					]
				}
			}
		},
		include: {
			category: true,
			translations: {
				where: { locale },
				take: 1,
			},
		},
		orderBy: { publishedAt: 'desc' },
		take: limit,
	});

	return items.map(item => normalizeContent(item, userTier));
});

/**
 * Fetches featured or most recent content for the homepage/dashboard.
 * Cached globally — revalidated by the "content:featured" tag.
 */
const _getFeaturedContent = unstable_cache(
	async (locale: string, limit: number) => {
		return db.content.findMany({
			where: {
				status: ContentStatus.PUBLISHED,
			},
			include: {
				category: true,
				translations: {
					where: { locale },
					take: 1,
				},
			},
			orderBy: [
				{ sortOrder: 'desc' },
				{ publishedAt: 'desc' }
			],
			take: limit,
		});
	},
	["featured-content"],
	{ revalidate: CONTENT_TTL, tags: [CACHE_TAGS.content, CACHE_TAGS.featured] }
);

export const getFeaturedContent = cache(async (
	locale: string, 
	userTier: SubscriptionTier = SubscriptionTier.FREE,
	limit = 5
) => {
	const items = await _getFeaturedContent(locale, limit);
	return items.map(item => normalizeContent(item, userTier));
});

/**
 * General purpose content fetcher with filtering.
 */
export const getContent = cache(async ({
	category,
	stage,
	query,
	user,
	locale = "en",
	limit = 20,
	skip = 0
}: {
	category?: string;
	stage?: RelationshipStage;
	query?: string;
	user?: any;
	locale?: string;
	limit?: number;
	skip?: number;
}) => {
	const userTier = user?.role === "ADMIN" ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE;

	const where: any = {
		status: ContentStatus.PUBLISHED,
	};

	if (category) {
		where.category = { slug: category };
	}

	if (stage && stage !== RelationshipStage.ANY) {
		where.relationshipStage = stage;
	}

	if (query) {
		where.translations = {
			some: {
				locale,
				OR: [
					{ title: { contains: query, mode: 'insensitive' } },
					{ summary: { contains: query, mode: 'insensitive' } }
				]
			}
		};
	}

	const items = await db.content.findMany({
		where,
		include: {
			category: true,
			translations: {
				where: { locale },
				take: 1,
			},
		},
		orderBy: { sortOrder: 'desc' },
		take: limit,
		skip,
	});

	return items.map(item => normalizeContent(item, userTier));
});
