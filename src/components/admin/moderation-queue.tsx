"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Clock, User, Hash, FileText, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface ModerationPost {
	id: string;
	title: string;
	body: string;
	topic: string;
	authorName: string;
	authorEmail: string | null;
	createdAt: string;
}

interface ModerationQueueProps {
	posts: ModerationPost[];
	onApprove: (id: string) => Promise<void>;
	onReject: (id: string) => Promise<void>;
}

export function ModerationQueue({ posts, onApprove, onReject }: ModerationQueueProps) {
	const t = useTranslations("admin");
	const [isPending, startTransition] = useTransition();

	if (posts.length === 0) {
		return (
			<div className="glass-morphism rounded-[48px] py-40 text-center border-dashed border-terra-500/10">
				<div className="w-20 h-20 bg-sage-500/5 rounded-full flex items-center justify-center mx-auto mb-6">
					<CheckCircle className="w-8 h-8 text-sage-500/40" />
				</div>
				<p className="text-xl font-light text-foreground/40 italic">{t("moderationPage.noPendingFlows")}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-8">
			{posts.map((post) => (
				<div 
					key={post.id} 
					className="glass-morphism rounded-[48px] p-10 group relative overflow-hidden flex flex-col xl:flex-row gap-12 hover:shadow-2xl hover:shadow-black/10 transition-all duration-700"
				>
					{/* Decorative Glow */}
					<div className="absolute top-0 right-0 w-80 h-80 bg-terra-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-terra-500/10 transition-colors duration-700" />
					
					{/* Content Section */}
					<div className="flex-1 space-y-8 relative z-10">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<span className="px-4 py-1 rounded-full bg-terra-500/10 text-terra-500 text-[10px] font-bold uppercase tracking-widest">
									{post.topic}
								</span>
								<span className="flex items-center gap-1.5 text-[10px] font-bold text-foreground/20 uppercase tracking-widest">
									<Clock className="w-3 h-3" />
									{new Date(post.createdAt).toLocaleString()}
								</span>
							</div>
							<h3 className="text-3xl font-light tracking-tight text-foreground group-hover:text-terra-500 transition-colors duration-500">
								{post.title}
							</h3>
						</div>
						
						<div className="prose prose-invert prose-sm max-w-none text-foreground/60 line-clamp-3 leading-relaxed font-medium">
							{post.body}
						</div>

						<div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/5">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-2xl bg-background/50 flex items-center justify-center shadow-inner">
									<User className="w-4 h-4 text-terra-500/40" />
								</div>
								<div>
									<p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">{t("moderationPage.architect")}</p>
									<p className="text-xs font-semibold text-foreground/80">{post.authorName}</p>
								</div>
							</div>
							{post.authorEmail && (
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-2xl bg-background/50 flex items-center justify-center shadow-inner">
										<Hash className="w-4 h-4 text-terra-500/40" />
									</div>
									<div>
										<p className="text-[9px] font-bold text-foreground/20 uppercase tracking-widest">{t("moderationPage.spiritId")}</p>
										<p className="text-xs font-semibold text-foreground/80">{post.authorEmail}</p>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Actions Section */}
					<div className="flex xl:flex-col items-center justify-center gap-4 relative z-10 xl:border-l xl:border-border/5 xl:pl-12 min-w-[200px]">
						<button
							disabled={isPending}
							onClick={() => startTransition(() => onApprove(post.id))}
							className="flex-1 xl:w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-sage-500 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-sage-500/20 disabled:opacity-50"
						>
							<CheckCircle className="w-4 h-4" />
							{t("moderationPage.approveFlow")}
						</button>
						<button
							disabled={isPending}
							onClick={() => startTransition(() => onReject(post.id))}
							className="flex-1 xl:w-full flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-background/50 text-foreground/40 border border-border/5 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-terra-500/10 hover:text-terra-500 hover:border-terra-500/20 transition-all disabled:opacity-50"
						>
							<XCircle className="w-4 h-4" />
							{t("moderationPage.rejectFlow")}
						</button>
					</div>
				</div>
			))}
		</div>
	);
}
