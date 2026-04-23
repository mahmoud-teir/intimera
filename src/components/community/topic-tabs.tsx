"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppCommunityTopic as CommunityTopic } from "@/lib/types/app-types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TopicTabsProps {
	topics: CommunityTopic[];
}

import { useTranslations } from "next-intl";

export function TopicTabs({ topics }: TopicTabsProps) {
	const pathname = usePathname();
	const t = useTranslations("community");

	return (
		<ScrollArea className="w-full whitespace-nowrap mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
			<div className="flex w-max space-x-4 px-2 rtl:space-x-reverse">
				<Link
					href="/community"
					className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
						pathname === "/community"
							? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
							: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
					}`}
				>
					{t("allTopics")}
				</Link>
				{topics.map((topic) => {
					const href = `/community/${topic.slug}`;
					const isActive = pathname === href;

					return (
						<Link
							key={topic.id}
							href={href}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
								isActive
									? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
									: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
							}`}
						>
							{t(`topic_${topic.slug}` as any) || topic.name}
						</Link>
					);
				})}
			</div>
			<ScrollBar orientation="horizontal" className="invisible" />
		</ScrollArea>
	);
}
