import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/learn/content-card";
import { ContentWithTranslation, SubscriptionTier } from "@/lib/dal/content";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function BookmarksPage() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) {
		redirect("/login");
	}

	const t = await getTranslations("bookmarks");
	const locale = await getLocale();
	
	const userTier = session?.user?.role === "ADMIN" 
		? SubscriptionTier.PREMIUM 
		: SubscriptionTier.FREE;

	// Fetch Bookmarks
	const bookmarks = await db.bookmark.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
		include: {
			content: {
				include: {
					category: true,
					translations: {
						where: { locale }
					}
				}
			}
		}
	});

	// Map to ContentWithTranslation structure
	const contentList: ContentWithTranslation[] = bookmarks.map(b => {
		const c = b.content;
		const isLocked = c.tier === SubscriptionTier.PREMIUM && userTier === SubscriptionTier.FREE;
		
		return {
			...c,
			translation: c.translations.length > 0 ? c.translations[0] : null,
			isLocked
		} as unknown as ContentWithTranslation;
	});

	return (
		<div className="max-w-6xl mx-auto py-6">
			{/* Page Header */}
			<div className="mb-10">
				<div className="flex items-center space-x-3 mb-4">
					<div className="w-12 h-12 bg-terra-100 dark:bg-terra-900/30 rounded-2xl flex items-center justify-center">
						<Bookmark className="w-6 h-6 text-terra-500 fill-terra-500/20" strokeWidth={1.5} />
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

			{/* Content Grid or Empty State */}
			{contentList.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{contentList.map((content) => (
						<ContentCard 
							key={content.id} 
							content={content} 
							initiallyBookmarked={true}
						/>
					))}
				</div>
			) : (
				<div className="py-24 text-center border border-dashed border-sand-200 dark:border-sand-800 rounded-3xl bg-white/30 dark:bg-black/10">
					<div className="w-16 h-16 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-sm border border-sand-100 dark:border-sand-800 mx-auto mb-6">
						<BookOpen className="w-8 h-8 text-sand-400" strokeWidth={1.5} />
					</div>
					<h3 className="text-xl font-medium text-sand-900 dark:text-sand-100 mb-3">
						{t("emptyTitle")}
					</h3>
					<p className="text-sand-500 max-w-md mx-auto mb-8 leading-relaxed">
						{t("emptyDescription")}
					</p>
					<Link href="/learn">
						<Button className="h-12 px-8 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:bg-sand-800 dark:hover:bg-sand-200 transition-colors">
							{t("exploreContent")}
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
