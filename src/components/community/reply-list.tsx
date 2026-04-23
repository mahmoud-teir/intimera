"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { VoteButtons } from "./vote-buttons";
import { createReply } from "@/actions/community";
import { Loader2, Reply, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { SafeHTML } from "@/components/ui/safe-html";

const RichTextEditor = dynamic(() => import("./rich-text-editor").then((mod) => mod.RichTextEditor), {
	ssr: false,
	loading: () => <div className="h-[100px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 animate-pulse" />
});

import { useTranslations, useLocale } from "next-intl";
import { ar, enUS } from "date-fns/locale";

// A mapped reply type matching what getPostById returns
export type ReplyWithNested = any; // Simplify for now

interface ReplyItemProps {
	reply: ReplyWithNested;
	postId: string;
	level?: number;
}

function ReplyItem({ reply, postId, level = 0 }: ReplyItemProps) {
	const t = useTranslations("community");
	const locale = useLocale();
	const dateLocale = locale === "ar" ? ar : enUS;

	const [isReplying, setIsReplying] = useState(false);
	const [replyBody, setReplyBody] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isAnonymous = reply.isAnonymous;
	const displayAuthor = isAnonymous 
		? t("anonymousUser") 
		: t("userPrefix", { id: reply.authorId.substring(0, 4) });

	const handleReplySubmit = async () => {
		if (!replyBody.trim()) return;

		setIsSubmitting(true);
		setError(null);

		const result = await createReply({
			postId,
			parentId: reply.id,
			body: replyBody,
			isAnonymous: true // Default to anonymous for replies
		});

		if (result.success) {
			setIsReplying(false);
			setReplyBody("");
		} else {
			setError(result.error || t("replyError"));
		}
		
		setIsSubmitting(false);
	};

	return (
		<div className={`mt-4 ${level > 0 ? "ml-6 sm:ml-10 rtl:ml-0 rtl:mr-6 rtl:sm:mr-10 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-100 dark:border-slate-800 pl-4 sm:pl-6 rtl:pl-0 rtl:pr-4 rtl:sm:pr-6" : ""}`}>
			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
				<div className="flex items-start gap-4">
					<div className="pt-1">
						<VoteButtons 
							targetId={reply.id} 
							type="reply" 
							initialScore={reply.voteScore} 
							initialUserVote={reply.userVote} 
						/>
					</div>
					
					<div className="flex-1 min-w-0">
						<div className="flex items-center text-xs text-slate-500 space-x-2 mb-2 rtl:space-x-reverse">
							<span className="font-medium text-slate-700 dark:text-slate-300">{displayAuthor}</span>
							<span>•</span>
							<span>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: dateLocale })}</span>
						</div>
						
						<SafeHTML
							html={reply.body}
							className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
						/>

						{level < 2 && (
							<div className="mt-3 flex items-center">
								<button 
									onClick={() => setIsReplying(!isReplying)}
									className="flex items-center text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
								>
									<Reply className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
									{t("reply")}
								</button>
							</div>
						)}

						{isReplying && (
							<div className="mt-4 space-y-3">
								{error && (
									<div className="text-xs text-red-500">{error}</div>
								)}
								<RichTextEditor content={replyBody} onChange={setReplyBody} placeholder={t("replyPlaceholder")} />
								<div className="flex justify-end gap-2">
									<button 
										onClick={() => setIsReplying(false)}
										className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"
									>
										{t("cancel")}
									</button>
									<button 
										onClick={handleReplySubmit}
										disabled={isSubmitting || !replyBody.trim()}
										className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md disabled:opacity-50 flex items-center"
									>
										{isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mr-1 rtl:mr-0 rtl:ml-1" /> : null}
										{t("postReply")}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Nested Replies */}
			{reply.children && reply.children.length > 0 && (
				<div className="mt-2">
					{reply.children.map((childReply: any) => (
						<ReplyItem key={childReply.id} reply={childReply} postId={postId} level={level + 1} />
					))}
				</div>
			)}
		</div>
	);
}

interface ReplyListProps {
	replies: ReplyWithNested[];
	postId: string;
}

export function ReplyList({ replies, postId }: ReplyListProps) {
	const t = useTranslations("community");
	const [isReplyingToPost, setIsReplyingToPost] = useState(false);
	const [replyBody, setReplyBody] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleReplySubmit = async () => {
		if (!replyBody.trim()) return;

		setIsSubmitting(true);
		setError(null);

		const result = await createReply({
			postId,
			body: replyBody,
			isAnonymous: true // Default to anonymous
		});

		if (result.success) {
			setIsReplyingToPost(false);
			setReplyBody("");
		} else {
			setError(result.error || t("replyError"));
		}
		
		setIsSubmitting(false);
	};

	return (
		<div className="mt-8">
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center">
					<MessageSquare className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 text-slate-400" />
					{t("discussions")}
				</h3>
				{!isReplyingToPost && (
					<button 
						onClick={() => setIsReplyingToPost(true)}
						className="px-4 py-2 text-sm font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
					>
						{t("addReply")}
					</button>
				)}
			</div>

			{isReplyingToPost && (
				<div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 mb-8">
					<h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">{t("yourReply")}</h4>
					{error && (
						<div className="text-xs text-red-500 mb-3">{error}</div>
					)}
					<RichTextEditor content={replyBody} onChange={setReplyBody} placeholder={t("shareThoughtsPlaceholder")} />
					<div className="flex justify-end gap-3 mt-3">
						<button 
							onClick={() => setIsReplyingToPost(false)}
							className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
						>
							{t("cancel")}
						</button>
						<button 
							onClick={handleReplySubmit}
							disabled={isSubmitting || !replyBody.trim()}
							className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-full disabled:opacity-50 flex items-center"
						>
							{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2 rtl:mr-0 rtl:ml-2" /> : null}
							{t("postReply")}
						</button>
					</div>
				</div>
			)}

			<div className="space-y-6">
				{replies.length === 0 ? (
					<div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
						<p className="text-slate-500">{t("noReplies")}</p>
					</div>
				) : (
					replies.map(reply => (
						<ReplyItem key={reply.id} reply={reply} postId={postId} />
					))
				)}
			</div>
		</div>
	);
}

