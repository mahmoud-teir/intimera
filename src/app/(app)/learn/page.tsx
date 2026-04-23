import { Suspense } from "react";
import { BookOpen, Search, Sparkles } from "lucide-react";
import { ContentFilterBar } from "@/components/learn/content-filter-bar";
import { ContentCard } from "@/components/learn/content-card";
import { getContent } from "@/lib/dal/content";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTranslations, getLocale } from "next-intl/server";
import { RelationshipStage } from "@/generated/prisma/client";

export const dynamic = 'force-dynamic';

export default async function LearnPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = await searchParams;
	const t = await getTranslations("learn");
	const locale = await getLocale();

	const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "all";
	const stageParam = typeof resolvedParams.stage === "string" ? resolvedParams.stage : "ANY";
	const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";

	const stage = Object.values(RelationshipStage).includes(stageParam as RelationshipStage)
		? (stageParam as RelationshipStage)
		: undefined;

	const session = await auth.api.getSession({
		headers: await headers()
	});

	// Pass user and locale to the DAL
	const content = await getContent({
		category: category !== "all" ? category : undefined,
		stage: stage,
		query: query || undefined,
		user: session?.user ?? undefined,
		locale: locale as "en" | "ar"
	});

	return (
		<div className="max-w-6xl mx-auto py-6">
			{/* Page Header */}
			<div className="mb-10">
				<div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
					<div className="w-12 h-12 bg-terra-100 dark:bg-terra-900/30 rounded-2xl flex items-center justify-center">
						<BookOpen className="w-6 h-6 text-terra-600" strokeWidth={1.5} />
					</div>
					<div>
						<h1 className="text-3xl font-light tracking-tight text-sand-900 dark:text-sand-100">
							{t("title")}
						</h1>
						<p className="text-sand-600 dark:text-sand-400 mt-1">
							{t("description")}
						</p>
					</div>
				</div>
			</div>

			{/* Filter Bar */}
			<Suspense fallback={<div className="h-16 bg-sand-100 dark:bg-sand-900/50 animate-pulse rounded-xl mb-8" />}>
				<ContentFilterBar />
			</Suspense>

			{/* Content Grid */}
			{content.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{content.map((item) => (
						<ContentCard key={item.id} content={item} />
					))}
				</div>
			) : (
				<div className="py-20 text-center border border-dashed border-sand-200 dark:border-sand-800 rounded-3xl">
					<Sparkles className="w-12 h-12 text-sand-300 dark:text-sand-700 mx-auto mb-4" strokeWidth={1} />
					<h3 className="text-lg font-medium text-sand-900 dark:text-sand-100 mb-2">{t("noContentTitle")}</h3>
					<p className="text-sand-500 max-w-md mx-auto">
						{t("noContentDescription")}
					</p>
				</div>
			)}
		</div>
	);
}
