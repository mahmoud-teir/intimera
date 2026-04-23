import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { PostWithCounts } from "@/actions/community";
import { VoteButtons } from "./vote-buttons";
import { useTranslations, useLocale } from "next-intl";
import { ar, enUS } from "date-fns/locale";

interface PostCardProps {
	post: PostWithCounts;
}

export function PostCard({ post }: PostCardProps) {
	const t = useTranslations("community");
	const locale = useLocale();
	
	const dateLocale = locale === "ar" ? ar : enUS;

	// Generate a consistent pseudo-random display name based on authorId if anonymous
	const isAnonymous = post.isAnonymous;
	const displayAuthor = isAnonymous 
		? t("anonymousUser") 
		: t("userPrefix", { id: post.authorId.substring(0, 4) });

	return (
		<Link 
			href={`/community/post/${post.id}`}
			className="block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
		>
			<div className="flex gap-4">
				{/* Voting Column */}
				<VoteButtons 
					targetId={post.id} 
					type="post" 
					initialScore={post.voteScore} 
					initialUserVote={0} 
				/>

				{/* Content Column */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center text-xs text-slate-500 space-x-2 mb-2 rtl:space-x-reverse">
						<span className="font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
							{t(`topic_${post.topic.slug}` as any) || post.topic.name}
						</span>
						<span>•</span>
						<span>{t("postedBy", { author: displayAuthor })}</span>
						<span>•</span>
						<span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: dateLocale })}</span>
					</div>

					<h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
						{post.title}
					</h3>

					<p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
						{post.body}
					</p>

					<div className="flex items-center text-slate-500 text-sm space-x-4 rtl:space-x-reverse">
						<div className="flex items-center space-x-1.5 hover:text-slate-900 dark:hover:text-white transition-colors rtl:space-x-reverse">
							<MessageSquare size={16} />
							<span>{t("repliesCount", { count: post._count.replies })}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
