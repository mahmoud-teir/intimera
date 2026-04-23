"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { 
	CheckCircle, 
	XCircle, 
	Trash2, 
	Eye, 
	EyeOff, 
	Edit3, 
	Clock, 
	Plus, 
	Search, 
	BookOpen,
	Bookmark,
	FileText,
	ChevronRight
} from "lucide-react";

type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING";
type SubscriptionTier = "FREE" | "PREMIUM" | "COUPLES";

interface ContentRow {
	id: string;
	title: string;
	slug: string;
	status: ContentStatus;
	category: string;
	categorySlug: string;
	tier: SubscriptionTier;
	bookmarks: number;
	coverImage: string | null;
	createdAt: string;
}

interface AdminContentTableProps {
	content: ContentRow[];
	viewerRole: string;
	onPublish: (id: string) => Promise<void>;
	onUnpublish: (id: string) => Promise<void>;
	onDelete: (id: string) => Promise<void>;
	onApprove: (id: string) => Promise<void>;
}


export function AdminContentTable({ 
	content, 
	viewerRole, 
	onPublish, 
	onUnpublish, 
	onDelete, 
	onApprove 
}: AdminContentTableProps) {
	const t = useTranslations("admin");
	const tCommon = useTranslations();
	const [filter, setFilter] = useState<"all" | "published" | "draft" | "pending">("all");
	const [search, setSearch] = useState("");
	const [isPending, startTransition] = useTransition();
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	const ContentStatusMap = {
		DRAFT: t("contentPage.status.DRAFT"),
		PUBLISHED: t("contentPage.status.PUBLISHED"),
		ARCHIVED: t("contentPage.status.ARCHIVED"),
		PENDING: t("contentPage.status.PENDING"),
	};

	const isAdmin = viewerRole === "ADMIN";

	const filtered = content.filter((c) => {
		const matchesFilter =
			filter === "all" ||
			(filter === "published" && c.status === "PUBLISHED") ||
			(filter === "draft" && c.status === "DRAFT") ||
			(filter === "pending" && c.status === "PENDING");
		const matchesSearch =
			(c.title || "").toLowerCase().includes(search.toLowerCase()) ||
			(c.slug || "").toLowerCase().includes(search.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	const pendingCount = content.filter((c) => c.status === "PENDING").length;

	return (
		<div className="space-y-12">
			{/* Editorial Toolbar */}
			<div className="flex flex-col lg:flex-row items-center gap-8">
				<div className="relative flex-1 w-full group">
					<Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-terra-500 transition-colors" />
					<input
						type="search"
						placeholder={t("contentPage.searchArchive")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full bg-subtle/50 border-none rounded-full px-14 py-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all font-medium"
					/>
				</div>
				<div className="flex p-1.5 rounded-full bg-subtle/50 border border-border/5 overflow-x-auto w-full lg:w-auto shrink-0">
					{(["all", "published", "draft", "pending"] as const).map((f) => (
						<button
							key={f}
							type="button"
							onClick={() => setFilter(f)}
							className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all shrink-0 ${
								filter === f
									? "bg-terra-500 text-white shadow-lg shadow-terra-500/20"
									: "text-foreground/40 hover:text-foreground hover:bg-background/40"
							}`}
						>
							{t(`contentPage.${f}` as any)}
							{f === "pending" && pendingCount > 0 && (
								<span className="ms-2 px-1.5 py-0.5 bg-background/20 rounded-full text-[10px]">{pendingCount}</span>
							)}
						</button>
					))}
				</div>
				<Link
					href="/admin/content/new"
					className="w-full lg:w-auto flex items-center justify-center gap-2 bg-terra-500 hover:bg-terra-600 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-terra-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0"
				>
					<Plus className="w-4 h-4" />
					{t("contentPage.newAsset")}
				</Link>
			</div>

			{/* Asset Grid - Editorial Card Layout */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
				{filtered.length === 0 ? (
					<div className="col-span-full bg-subtle/20 rounded-[48px] py-40 text-center border border-dashed border-border/20">
						<p className="text-foreground/60 font-semibold italic">{t("contentPage.noAssets")}</p>
					</div>
				) : (
					filtered.map((item) => (
						<div 
							key={item.id} 
							className="group bg-surface/50 dark:bg-sanctum/50 hover:bg-surface dark:hover:bg-sanctum transition-all duration-500 rounded-[48px] p-8 border border-border/5 flex flex-col h-full hover:shadow-2xl hover:shadow-black/5"
						>
							<div className="flex items-start justify-between mb-8">
								{item.coverImage ? (
									<div className="w-16 h-16 rounded-3xl overflow-hidden bg-subtle shadow-inner group-hover:scale-110 transition-transform duration-500">
										<img src={item.coverImage} alt="" className="w-full h-full object-cover" />
									</div>
								) : (
									<div className="p-4 rounded-3xl bg-background shadow-inner transition-transform duration-500 group-hover:scale-110">
										<FileText className="w-6 h-6 text-amber-500" />
									</div>
								)}
								<div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
									item.status === "PUBLISHED" 
										? "bg-sage-500/10 text-sage-600 dark:text-sage-400 border-sage-500/20" 
										: item.status === "PENDING"
										? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 animate-pulse"
										: "bg-foreground/10 text-foreground/60 border-border/10"
								}`}>
									{ContentStatusMap[item.status]}
								</div>
							</div>

							<div className="flex-1 space-y-4">
								<p className="text-xs font-bold text-terra-500 uppercase tracking-[0.3em]">
									{tCommon(`library.cat_${item.categorySlug}` as any) !== `library.cat_${item.categorySlug}`
										? tCommon(`library.cat_${item.categorySlug}` as any)
										: item.category}
								</p>
								<h3 className="text-xl font-medium tracking-tight text-foreground leading-tight group-hover:text-terra-500 transition-colors">
									{item.title}
								</h3>
								<div className="flex items-center gap-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">
									<span className="flex items-center gap-1.5">
										<Bookmark className="w-3 h-3" />
										{item.bookmarks} {t("contentPage.saves")}
									</span>
									<span className="w-1 h-1 bg-border/40 rounded-full" />
									<span className="flex items-center gap-1.5">
										<Clock className="w-3 h-3" />
										{new Date(item.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>

							<div className="mt-10 pt-8 border-t border-border/5 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Link
										href={`/admin/content/${item.id}/edit`}
										className="p-3 rounded-2xl bg-subtle text-foreground/40 hover:text-terra-500 hover:bg-terra-500/10 transition-all"
										title={t("contentPage.editAsset")}
									>
										<Edit3 className="w-4 h-4" />
									</Link>
									{isAdmin && item.status === "PENDING" && (
										<button
											onClick={() => startTransition(() => onApprove(item.id))}
											className="p-3 rounded-2xl bg-terra-500 text-white shadow-lg shadow-terra-500/20 hover:scale-105 transition-all"
											title={t("contentPage.approvePublish")}
										>
											<CheckCircle className="w-4 h-4" />
										</button>
									)}
									{isAdmin && item.status === "PUBLISHED" && (
										<button
											onClick={() => startTransition(() => onUnpublish(item.id))}
											className="p-3 rounded-2xl bg-subtle text-foreground/40 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
											title={t("contentPage.retractAsset")}
										>
											<EyeOff className="w-4 h-4" />
										</button>
									)}
									{isAdmin && (item.status === "DRAFT" || item.status === "ARCHIVED") && (
										<button
											onClick={() => startTransition(() => onPublish(item.id))}
											className="p-3 rounded-2xl bg-subtle text-foreground/40 hover:text-sage-500 hover:bg-sage-500/10 transition-all"
											title={t("contentPage.curateAsset")}
										>
											<Eye className="w-4 h-4" />
										</button>
									)}
								</div>
								
								<button
									disabled={isPending}
									onClick={() => setConfirmDeleteId(item.id)}
									className="text-xs font-bold text-foreground/40 hover:text-terra-500 uppercase tracking-widest transition-colors flex items-center gap-2 group/delete"
								>
									{t("contentPage.discard")}
									<ChevronRight className="w-3 h-3 group-hover/delete:translate-x-1 transition-transform" />
								</button>
							</div>

							{confirmDeleteId === item.id && (
								<div className="absolute inset-0 z-20 glass-morphism rounded-[48px] flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in duration-300">
									<div className="w-16 h-16 rounded-full bg-terra-500/10 flex items-center justify-center mb-6">
										<Trash2 className="w-8 h-8 text-terra-500" />
									</div>
									<h4 className="text-lg font-bold text-foreground mb-2">{t("contentPage.discardTitle")}</h4>
									<p className="text-xs font-semibold text-foreground/40 leading-relaxed mb-8">
										{t("contentPage.discardConfirmText", { title: item.title })}
									</p>
									<div className="flex flex-col w-full gap-3">
										<button
											disabled={isPending}
											onClick={() => {
												startTransition(async () => {
													await onDelete(item.id);
													setConfirmDeleteId(null);
												});
											}}
											className="w-full py-4 rounded-full bg-terra-500 text-white font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-terra-500/20 hover:bg-terra-600 transition-all disabled:opacity-50"
										>
											{t("contentPage.confirmDiscard")}
										</button>
										<button
											onClick={() => setConfirmDeleteId(null)}
											className="w-full py-4 rounded-full bg-background/50 text-foreground/40 font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-background transition-all"
										>
											{tCommon("common.cancel")}
										</button>
									</div>
								</div>
							)}
						</div>
					))
				)}
			</div>

			<div className="flex items-center justify-center pt-12 text-sm font-bold text-foreground/40 uppercase tracking-[0.4em]">
				{t("common.archiveOptimal")}
			</div>
		</div>
	);
}
