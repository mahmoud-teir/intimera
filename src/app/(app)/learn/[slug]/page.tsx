import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Clock, Signal, Lock } from "lucide-react";
import { getContentBySlug, SubscriptionTier } from "@/lib/dal/content";
import { ContentRenderer } from "@/components/learn/content-renderer";
import { TableOfContents } from "@/components/learn/table-of-contents";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://intimera.app";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const locale = await getLocale();
	const t = await getTranslations("library");
	
	const content = await getContentBySlug(slug, locale, SubscriptionTier.FREE);

	if (!content || !content.translation) {
		return { title: t("notFound") };
	}

	const { title, summary } = content.translation;
	const ogUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(summary)}&category=${encodeURIComponent(content.category.name)}`;

	return {
		title,
		description: summary,
		openGraph: {
			title,
			description: summary,
			type: "article",
			url: `${BASE_URL}/learn/${slug}`,
			images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: summary,
			images: [ogUrl],
		},
	};
}

export default async function ContentReaderPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const resolvedParams = await params;
	const locale = await getLocale();
	const t = await getTranslations("library");
	
	const session = await auth.api.getSession({
		headers: await headers()
	});

	const userTier = (session?.user as any)?.role === "ADMIN" 
		? SubscriptionTier.PREMIUM 
		: SubscriptionTier.FREE;

	const content = await getContentBySlug(resolvedParams.slug, locale, userTier);

	if (!content) {
		notFound();
	}

	const title = content.translation?.title || t("untitled");
	const summary = content.translation?.summary || "";
	const body = content.translation?.body || "";

	return (
		<div className="max-w-6xl mx-auto py-6 relative">
			{/* Back Navigation */}
			<div className="mb-8">
				<Link 
					href="/learn" 
					className="inline-flex items-center text-sm font-medium text-sand-500 hover:text-terra-600 dark:hover:text-terra-400 transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
					{t("back")}
				</Link>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
				{/* Main Article Area */}
				<article className="lg:col-span-8 xl:col-span-9">
					{/* Header */}
					<header className="mb-10">
						<div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-sage-600 dark:text-sage-400 mb-4">
							<span className="bg-sage-100 dark:bg-sage-900/30 px-2.5 py-1 rounded-md">
								{content.category.name}
							</span>
							{content.isLocked && (
								<span className="bg-sand-200 dark:bg-sand-800 text-sand-700 dark:text-sand-300 px-2.5 py-1 rounded-md flex items-center">
									<Lock className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" /> {t("locked")}
								</span>
							)}
						</div>
						
						<h1 className="text-4xl md:text-5xl font-light tracking-tight text-sand-900 dark:text-sand-100 mb-6 leading-tight">
							{title}
						</h1>
						
						<div className="flex items-center space-x-6 rtl:space-x-reverse text-sm text-sand-500">
							<span className="flex items-center">
								<Clock className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
								{t("minRead", { count: content.readingTimeMin })}
							</span>
							<span className="flex items-center">
								<Signal className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
								{content.difficulty.charAt(0) + content.difficulty.slice(1).toLowerCase()}
							</span>
						</div>
					</header>

					<div className="h-px w-full bg-sand-200 dark:bg-sand-800 mb-10" />

					{/* Body Content or Paywall */}
					{content.isLocked ? (
						<div className="bg-white/50 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-br from-terra-500/5 to-sage-500/5 pointer-events-none" />
							
							<div className="w-16 h-16 bg-sand-100 dark:bg-sand-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
								<Lock className="w-8 h-8 text-terra-500" />
							</div>
							
							<h3 className="text-2xl font-medium text-sand-900 dark:text-sand-100 mb-4">
								{t("unlockTitle")}
							</h3>
							<p className="text-sand-600 dark:text-sand-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
								{summary}
							</p>
							<div className="space-y-4">
								<p className="text-sm font-medium text-sand-500 uppercase tracking-wider">
									{t("availablePremium")}
								</p>
								<Link href="/settings/subscription" className="inline-block">
									<Button className="h-12 px-8 bg-terra-500 hover:bg-terra-600 text-white rounded-xl shadow-md transition-all text-base font-medium">
										{t("upgradePremium")}
									</Button>
								</Link>
							</div>
						</div>
					) : (
						<ContentRenderer contentId={content.id} markdown={body} />
					)}
				</article>

				{/* Sidebar (TOC) */}
				{!content.isLocked && (
					<aside className="hidden lg:block lg:col-span-4 xl:col-span-3">
						<TableOfContents markdown={body} />
					</aside>
				)}
			</div>
		</div>
	);
}
