import { getPostById } from "@/actions/community";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { VoteButtons } from "@/components/community/vote-buttons";
import { ReplyList } from "@/components/community/reply-list";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SafeHTML } from "@/components/ui/safe-html";
import { getTranslations, getLocale } from "next-intl/server";
import { ar, enUS } from "date-fns/locale";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;
	const result = await getPostById(resolvedParams.id);
	const t = await getTranslations("community");
	
	if (!result.success || !result.post) {
		return {
			title: `${t("postNotFound")} | Intimera Community`,
		};
	}

	return {
		title: `${result.post.title} | Intimera Community`,
		description: result.post.body.substring(0, 150) + "...",
	};
}

export default async function PostThreadPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;
	const result = await getPostById(resolvedParams.id);
	const t = await getTranslations("community");
	const locale = await getLocale();
	const dateLocale = locale === "ar" ? ar : enUS;

	if (!result.success || !result.post) {
		notFound();
	}

	const { post } = result;
	const isAnonymous = post.isAnonymous;
	const displayAuthor = isAnonymous 
		? t("anonymousUser") 
		: t("userPrefix", { id: post.authorId.substring(0, 4) });

	return (
		<div className="container max-w-4xl mx-auto px-4 py-8">
			<Link 
				href={`/community/${post.topic.slug}`}
				className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 rtl:space-x-reverse"
			>
				<ChevronLeft size={16} className="mr-1 rtl:mr-0 rtl:ml-1 rtl:rotate-180" />
				{t("backToTopic", { topic: t(`topic_${post.topic.slug}` as any) || post.topic.name })}
			</Link>

			{/* Original Post */}
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-8">
				<div className="flex gap-4 sm:gap-6">
					<div className="pt-2">
						<VoteButtons 
							targetId={post.id} 
							type="post" 
							initialScore={post.voteScore} 
							initialUserVote={post.userVote} 
						/>
					</div>
					
					<div className="flex-1 min-w-0">
						<div className="flex items-center text-xs text-hint space-x-2 mb-3 rtl:space-x-reverse">
							<Link href={`/community/${post.topic.slug}`} className="font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
								{t(`topic_${post.topic.slug}` as any) || post.topic.name}
							</Link>
							<span>•</span>
							<span>{t("postedBy", { author: displayAuthor })}</span>
							<span>•</span>
							<span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: dateLocale })}</span>
						</div>

						<h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
							{post.title}
						</h1>

						<SafeHTML
							html={post.body}
							className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
						/>
					</div>
				</div>
			</div>

			{/* Replies */}
			<ReplyList replies={post.replies} postId={post.id} />
		</div>
	);
}
