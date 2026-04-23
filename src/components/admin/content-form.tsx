"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Globe, ImagePlus, X, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";

interface Category {
	id: string;
	name: string;
}

interface ContentFormProps {
	initialData?: any;
	categories: Category[];
	onSave: (data: any) => Promise<void>;
}

export function ContentForm({ initialData, categories, onSave }: ContentFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
	const bodyRef = useRef<HTMLTextAreaElement>(null);
	const [isUploadingInline, setIsUploadingInline] = useState(false);

	const [formData, setFormData] = useState({
		slug: initialData?.slug || "",
		categoryId: initialData?.categoryId || categories[0]?.id || "",
		tier: initialData?.tier || "FREE",
		status: initialData?.status || "DRAFT",
		difficulty: initialData?.difficulty || "BEGINNER",
		relationshipStage: initialData?.relationshipStage || "ANY",
		readingTimeMin: initialData?.readingTimeMin || 5,
		coverImage: initialData?.coverImage || "",
		translations: {
			en: {
				title: initialData?.translations?.find((t: any) => t.locale === "en")?.title || "",
				summary: initialData?.translations?.find((t: any) => t.locale === "en")?.summary || "",
				body: initialData?.translations?.find((t: any) => t.locale === "en")?.body || "",
			},
			ar: {
				title: initialData?.translations?.find((t: any) => t.locale === "ar")?.title || "",
				summary: initialData?.translations?.find((t: any) => t.locale === "ar")?.summary || "",
				body: initialData?.translations?.find((t: any) => t.locale === "ar")?.body || "",
			},
		},
	});

	const handleTranslationChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			translations: {
				...prev.translations,
				[activeLocale]: {
					...prev.translations[activeLocale],
					[field]: value,
				},
			},
		}));
	};

	// Insert markdown image at cursor position in the body textarea
	const insertImageAtCursor = (url: string) => {
		const textarea = bodyRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;
		const currentBody = formData.translations[activeLocale].body;
		const markdownImage = `\n![image](${url})\n`;

		const newBody =
			currentBody.substring(0, start) +
			markdownImage +
			currentBody.substring(end);

		handleTranslationChange("body", newBody);

		// Restore cursor position after the inserted text
		setTimeout(() => {
			textarea.focus();
			const newPos = start + markdownImage.length;
			textarea.setSelectionRange(newPos, newPos);
		}, 0);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		startTransition(async () => {
			await onSave(formData);
			router.push("/admin/content");
			router.refresh();
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-8 pb-20">
			{/* Form Header */}
			<div className="flex items-center justify-between mb-8">
				<Link
					href="/admin/content"
					className="flex items-center gap-3 text-foreground/40 hover:text-foreground transition-colors text-[10px] font-bold uppercase tracking-[0.2em]"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to Vault
				</Link>
				<button
					type="submit"
					disabled={isPending}
					className="flex items-center gap-3 px-10 py-4 rounded-full bg-terra-500 hover:bg-terra-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-50 shadow-xl shadow-terra-500/20"
				>
					<Save className="w-4 h-4" />
					{initialData ? "Update Asset" : "Vault Asset"}
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
				{/* Main Content Area */}
				<div className="lg:col-span-2 space-y-10">
					{/* Cover Image Upload */}
					<div className="bg-surface/40 dark:bg-sanctum/40 backdrop-blur-xl rounded-[48px] p-10 border border-border/5 space-y-6">
						<h2 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">
							Cover Visual
						</h2>

						{formData.coverImage ? (
							<div className="relative group rounded-[32px] overflow-hidden aspect-[21/9] bg-subtle">
								<Image
									src={formData.coverImage}
									alt="Cover"
									fill
									className="object-cover"
								/>
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
									<button
										type="button"
										onClick={() =>
											setFormData((prev) => ({
												...prev,
												coverImage: "",
											}))
										}
										className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/30"
									>
										<X className="w-4 h-4" />
										Remove Cover
									</button>
								</div>
							</div>
						) : (
							<UploadDropzone
								endpoint="coverImage"
								onClientUploadComplete={(res) => {
									if (res?.[0]) {
										setFormData((prev) => ({
											...prev,
											coverImage: res[0].ufsUrl,
										}));
									}
								}}
								onUploadError={(error: Error) => {
									alert(`Upload failed: ${error.message}`);
								}}
								className="ut-ready:border-terra-500/20 ut-uploading:border-terra-500/40 border-2 border-dashed border-border/20 rounded-[32px] bg-subtle/20 p-16 ut-button:bg-terra-500 ut-button:rounded-full ut-button:px-8 ut-button:py-3 ut-button:text-[10px] ut-button:font-bold ut-button:uppercase ut-button:tracking-widest ut-button:shadow-lg ut-button:shadow-terra-500/20 ut-label:text-foreground/40 ut-label:text-sm ut-allowed-content:text-foreground/20 ut-allowed-content:text-[10px]"
								appearance={{
									container: "min-h-[200px] flex flex-col items-center justify-center gap-4",
									label: "text-foreground/40 font-medium",
									allowedContent: "text-foreground/20 text-[10px] uppercase tracking-widest",
								}}
							/>
						)}
					</div>

					{/* Localizations */}
					<div className="bg-surface/40 dark:bg-sanctum/40 backdrop-blur-xl rounded-[48px] p-10 border border-border/5 space-y-8">
						<div className="flex items-center justify-between pb-6">
							<h2 className="text-lg font-light text-foreground flex items-center gap-3 tracking-tight">
								<Globe className="w-5 h-5 text-terra-500" />
								Localizations
							</h2>
							<div className="flex p-1.5 rounded-full bg-subtle/50 border border-border/5">
								{(["en", "ar"] as const).map((l) => (
									<button
										key={l}
										type="button"
										onClick={() => setActiveLocale(l)}
										className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${
											activeLocale === l
												? "bg-terra-500 text-white shadow-lg shadow-terra-500/20"
												: "text-foreground/40 hover:text-foreground"
										}`}
									>
										{l === "en" ? "English" : "العربية"}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-6" dir={activeLocale === "ar" ? "rtl" : "ltr"}>
							<div>
								<label className="block text-[10px] font-bold text-terra-500 uppercase tracking-[0.3em] mb-3 px-2">
									Title ({activeLocale.toUpperCase()})
								</label>
								<input
									type="text"
									required
									value={formData.translations[activeLocale].title}
									onChange={(e) => handleTranslationChange("title", e.target.value)}
									className="w-full bg-subtle/30 border-none rounded-full px-8 py-5 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all font-semibold text-lg"
									placeholder="Enter a compelling title..."
								/>
							</div>

							<div>
								<label className="block text-[10px] font-bold text-terra-500 uppercase tracking-[0.3em] mb-3 px-2">
									Summary
								</label>
								<textarea
									rows={3}
									required
									value={formData.translations[activeLocale].summary}
									onChange={(e) => handleTranslationChange("summary", e.target.value)}
									className="w-full bg-subtle/30 border-none rounded-3xl px-8 py-5 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all text-sm leading-relaxed resize-none font-medium"
									placeholder="Brief overview of the article..."
								/>
							</div>

							<div>
								<div className="flex items-center justify-between mb-3 px-2">
									<label className="block text-[10px] font-bold text-terra-500 uppercase tracking-[0.3em]">
										Body Content (Markdown)
									</label>
									
									{/* Inline Image Upload Button */}
									<div className="relative">
										<UploadDropzone
											endpoint="contentImage"
											onUploadBegin={() => setIsUploadingInline(true)}
											onClientUploadComplete={(res) => {
												setIsUploadingInline(false);
												if (res?.[0]) {
													insertImageAtCursor(res[0].ufsUrl);
												}
											}}
											onUploadError={(error: Error) => {
												setIsUploadingInline(false);
												alert(`Upload failed: ${error.message}`);
											}}
											className="ut-ready:border-terra-500/20 ut-uploading:border-terra-500/40 border border-dashed border-border/10 rounded-2xl bg-subtle/20 p-4 ut-button:bg-terra-500 ut-button:rounded-full ut-button:px-4 ut-button:py-2 ut-button:text-[9px] ut-button:font-bold ut-button:uppercase ut-button:tracking-widest ut-label:text-foreground/30 ut-label:text-[10px] ut-allowed-content:hidden"
											appearance={{
												container: "flex flex-col items-center gap-2 min-h-0",
												label: "text-foreground/30 text-[10px]",
												button: "text-[9px]",
											}}
											content={{
												label: isUploadingInline ? "Uploading..." : "Drop image for body",
												button: isUploadingInline ? (
													<span className="flex items-center gap-2">
														<Loader2 className="w-3 h-3 animate-spin" /> Uploading
													</span>
												) : (
													<span className="flex items-center gap-2">
														<ImagePlus className="w-3 h-3" /> Insert Image
													</span>
												),
											}}
										/>
									</div>
								</div>
								<textarea
									ref={bodyRef}
									rows={18}
									required
									value={formData.translations[activeLocale].body}
									onChange={(e) => handleTranslationChange("body", e.target.value)}
									className="w-full bg-subtle/30 border-none rounded-3xl px-8 py-5 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all font-mono text-sm leading-relaxed"
									placeholder="# Your content starts here..."
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Metadata Sidebar */}
				<div className="space-y-10">
					<div className="bg-surface/40 dark:bg-sanctum/40 backdrop-blur-xl rounded-[48px] p-10 border border-border/5 space-y-8 sticky top-8">
						<h2 className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] pb-4 border-b border-border/5">
							Asset Configuration
						</h2>
						
						<div className="space-y-6">
							<div>
								<label className="block text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">Slug</label>
								<input
									type="text"
									required
									value={formData.slug}
									onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
									className="w-full bg-subtle/30 border-none rounded-full px-6 py-3.5 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all font-mono text-xs"
								/>
							</div>

							<div>
								<label className="block text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">Category</label>
								<select
									value={formData.categoryId}
									onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
									className="w-full bg-subtle/30 border-none rounded-full px-6 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all cursor-pointer text-xs appearance-none"
								>
									{categories.map(c => (
										<option key={c.id} value={c.id}>{c.name}</option>
									))}
								</select>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">Tier</label>
									<select
										value={formData.tier}
										onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
										className="w-full bg-subtle/30 border-none rounded-full px-6 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all cursor-pointer text-xs appearance-none"
									>
										<option value="FREE">Free</option>
										<option value="PREMIUM">Premium</option>
										<option value="COUPLES">Couples</option>
									</select>
								</div>
								<div>
									<label className="block text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">Status</label>
									<select
										value={formData.status}
										onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
										className="w-full bg-subtle/30 border-none rounded-full px-6 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all cursor-pointer text-xs appearance-none"
									>
										<option value="DRAFT">Draft</option>
										<option value="PUBLISHED">Published</option>
										<option value="ARCHIVED">Archived</option>
									</select>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">Difficulty</label>
									<select
										value={formData.difficulty}
										onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
										className="w-full bg-subtle/30 border-none rounded-full px-6 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all cursor-pointer text-xs appearance-none"
									>
										<option value="BEGINNER">Beginner</option>
										<option value="INTERMEDIATE">Intermediate</option>
										<option value="ADVANCED">Advanced</option>
									</select>
								</div>
								<div>
									<label className="block text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">Read Time</label>
									<input
										type="number"
										value={formData.readingTimeMin}
										onChange={(e) => setFormData(prev => ({ ...prev, readingTimeMin: parseInt(e.target.value) }))}
										className="w-full bg-subtle/30 border-none rounded-full px-6 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all text-xs"
									/>
								</div>
							</div>

							<div>
								<label className="block text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em] mb-3">Stage</label>
								<select
									value={formData.relationshipStage}
									onChange={(e) => setFormData(prev => ({ ...prev, relationshipStage: e.target.value }))}
									className="w-full bg-subtle/30 border-none rounded-full px-6 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-terra-500/10 transition-all cursor-pointer text-xs appearance-none"
								>
									<option value="ANY">Any Stage</option>
									<option value="DATING">Dating</option>
									<option value="ENGAGED">Engaged</option>
									<option value="NEWLYWED">Newlywed</option>
									<option value="ESTABLISHED">Established</option>
									<option value="RECONNECTING">Reconnecting</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
	);
}
