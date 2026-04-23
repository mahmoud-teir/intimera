"use client";

import { PostWithCounts } from "@/actions/community";
import { PostCard } from "./post-card";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface PostListProps {
	posts: PostWithCounts[];
	sortBy: "recent" | "popular";
}

import { useTranslations } from "next-intl";

export function PostList({ posts, sortBy }: PostListProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const t = useTranslations("community");

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const handleSortChange = (newSort: "recent" | "popular") => {
		router.push(pathname + "?" + createQueryString("sort", newSort));
	};

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-xl font-semibold text-slate-900 dark:text-white">
					{t("discussions")}
				</h2>
				<div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
					<button
						onClick={() => handleSortChange("recent")}
						className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
							sortBy === "recent"
								? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
								: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
						}`}
					>
						{t("recent")}
					</button>
					<button
						onClick={() => handleSortChange("popular")}
						className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
							sortBy === "popular"
								? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
								: "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
						}`}
					>
						{t("popular")}
					</button>
				</div>
			</div>

			{posts.length === 0 ? (
				<div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
					<p className="text-secondary">{t("noPosts")}</p>
				</div>
			) : (
				<div className="space-y-4">
					{posts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			)}
		</div>
	);
}
