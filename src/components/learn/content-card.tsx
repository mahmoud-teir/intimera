"use client";

import Link from "next/link";
import Image from "next/image";
import { useTransition, useState } from "react";
import { ContentWithTranslation } from "@/lib/dal/content";
import { toggleBookmark } from "@/actions/bookmark";
import { Lock, Clock, Signal, Bookmark, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function ContentCard({ 
	content, 
	initiallyBookmarked = false 
}: { 
	content: ContentWithTranslation, 
	initiallyBookmarked?: boolean 
}) {
	const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);
	const [isPending, startTransition] = useTransition();
	const t = useTranslations("library");

	const handleBookmark = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// Optimistic update
		setIsBookmarked(!isBookmarked);

		startTransition(async () => {
			const res = await toggleBookmark(content.id);
			if (!res.success) {
				// Revert on error
				setIsBookmarked(isBookmarked);
			}
		});
	};

	const title = content.translation?.title || t("untitled");
	const summary = content.translation?.summary || t("noDescription");

	return (
		<Link 
			href={content.isLocked ? "/settings/subscription" : `/learn/${content.slug}`}
			className="group block relative h-full bg-white/5 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
		>
			{/* Thumbnail Placeholder */}
			<div className="h-40 w-full bg-sand-100 dark:bg-sand-900/50 relative overflow-hidden flex items-center justify-center">
				{content.coverImage ? (
					<Image 
						src={content.coverImage} 
						alt={title} 
						fill 
						className="object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="absolute inset-0 bg-gradient-to-tr from-terra-500/20 to-sage-500/20 opacity-50 group-hover:opacity-100 transition-opacity" />
				)}
				{content.isLocked && (
					<div className="absolute top-3 inset-s-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center">
						<Lock className="w-3 h-3 me-1" /> {t("locked")}
					</div>
				)}
				<div className="absolute top-3 inset-e-3 z-10">
					<button 
						onClick={handleBookmark}
						disabled={isPending}
						className="w-8 h-8 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-sand-600 hover:text-terra-500 transition-colors"
					>
						<Bookmark 
							className={`w-4 h-4 ${isBookmarked ? "fill-terra-500 text-terra-500" : ""}`} 
						/>
					</button>
				</div>
			</div>

			{/* Content Details */}
			<div className="p-5 flex flex-col h-[calc(100%-10rem)]">
				<div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-medium text-sage-600 dark:text-sage-400 mb-2">
					<span className="bg-sage-100 dark:bg-sage-900/30 px-2 py-0.5 rounded-sm">
						{t(`cat_${content.category.slug}` as any) || content.category.name}
					</span>
				</div>

				<h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100 mb-2 line-clamp-2 group-hover:text-terra-600 dark:group-hover:text-terra-400 transition-colors">
					{title}
				</h3>

				<p className="text-sm text-sand-600 dark:text-sand-400 line-clamp-3 mb-4 flex-grow">
					{summary}
				</p>

				<div className="flex items-center justify-between text-xs text-sand-500 dark:text-sand-500 border-t border-sand-100 dark:border-sand-800 pt-3 mt-auto">
					<div className="flex items-center space-x-3 rtl:space-x-reverse">
						<span className="flex items-center">
							<Clock className="w-3 h-3 me-1" />
							{t("min", { count: content.readingTimeMin })}
						</span>
						<span className="flex items-center">
							<Signal className="w-3 h-3 me-1" />
							{t(content.difficulty.toLowerCase() as any)}
						</span>
					</div>
					<ChevronRight className="w-4 h-4 text-sand-400 group-hover:text-terra-500 transition-colors group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
				</div>
			</div>
		</Link>
	);
}
