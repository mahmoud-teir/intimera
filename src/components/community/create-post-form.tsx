"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AppCommunityTopic as CommunityTopic } from "@/lib/types/app-types";
import { createPost } from "@/actions/community";
import { Loader2 } from "lucide-react";
// Dynamically import Tiptap to reduce initial bundle size
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const RichTextEditor = dynamic(() => import("./rich-text-editor").then((mod) => mod.RichTextEditor), {
	ssr: false,
	loading: () => <div className="h-[200px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 animate-pulse" />
});

interface CreatePostFormProps {
	topics: CommunityTopic[];
	initialTopicId?: string;
}

export function CreatePostForm({ topics, initialTopicId }: CreatePostFormProps) {
	const router = useRouter();
	const t = useTranslations("community");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [title, setTitle] = useState("");
	const [topicId, setTopicId] = useState(initialTopicId || (topics.length > 0 ? topics[0].id : ""));
	const [body, setBody] = useState("");
	const [isAnonymous, setIsAnonymous] = useState(true);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !body.trim() || !topicId) return;

		setIsSubmitting(true);
		setError(null);

		const result = await createPost({ title, body, topicId, isAnonymous });

		if (result.success && result.post) {
			router.push(`/community/post/${result.post.id}`);
		} else {
			setError(result.error || t("createError"));
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{error && (
				<div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm">
					{error}
				</div>
			)}

			<div className="space-y-4">
				<div>
					<label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
						{t("topicLabel")}
					</label>
					<select
						id="topic"
						value={topicId}
						onChange={(e) => setTopicId(e.target.value)}
						className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						required
					>
						<option value="" disabled>{t("selectTopic")}</option>
						{topics.map((topic) => (
							<option key={topic.id} value={topic.id}>
								{t(`topic_${topic.slug}` as any) || topic.name}
							</option>
						))}
					</select>
				</div>

				<div>
					<label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
						{t("titleLabel")}
					</label>
					<input
						type="text"
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder={t("titlePlaceholder")}
						className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						maxLength={100}
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
						{t("contentLabel")}
					</label>
					<RichTextEditor content={body} onChange={setBody} />
				</div>
				
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="anonymous"
						checked={isAnonymous}
						onChange={(e) => setIsAnonymous(e.target.checked)}
						className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
					/>
					<label htmlFor="anonymous" className="text-sm text-slate-600 dark:text-slate-400">
						{t("postAnonymously")}
					</label>
				</div>
			</div>

			<div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 gap-4">
				<button
					type="button"
					onClick={() => router.back()}
					className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
				>
					{t("cancel")}
				</button>
				<button
					type="submit"
					disabled={isSubmitting || !title.trim() || !body.trim() || !topicId}
					className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="w-4 h-4 me-2 animate-spin" />
							{t("posting")}
						</>
					) : (
						t("postButton")
					)}
				</button>
			</div>
		</form>
	);
}
