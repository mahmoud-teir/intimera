import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { ContentStatus } from "@/generated/prisma/client";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://intimera.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Static public routes
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${BASE_URL}/pricing`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/login`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${BASE_URL}/register`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.5,
		},
	];

	// Dynamic content routes — only published articles in English
	const publishedContent = await db.content.findMany({
		where: { status: ContentStatus.PUBLISHED },
		select: { slug: true, publishedAt: true, updatedAt: true },
	});

	const contentRoutes: MetadataRoute.Sitemap = publishedContent.map((article) => ({
		url: `${BASE_URL}/learn/${article.slug}`,
		lastModified: article.updatedAt || article.publishedAt || new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	return [...staticRoutes, ...contentRoutes];
}
