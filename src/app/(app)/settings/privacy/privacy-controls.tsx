"use client";

import { useState, useTransition } from "react";
import { Download, Trash2, Loader2, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/actions/settings";
import { useTranslations } from "next-intl";

export function PrivacyControls() {
	const t = useTranslations("privacy");
	const [isExporting, setIsExporting] = useState(false);
	const [isDeleting, startDeleting] = useTransition();
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [confirmText, setConfirmText] = useState("");
	const [exportError, setExportError] = useState<string | null>(null);

	/** Use the API route so the browser handles it as a native file download. */
	const handleExport = async () => {
		setIsExporting(true);
		setExportError(null);
		try {
			const res = await fetch("/api/data/export");
			if (!res.ok) {
				const body = await res.json().catch(() => ({}));
				throw new Error(body.error || t("exportError"));
			}
			const blob = await res.blob();
			const filename =
				res.headers
					.get("Content-Disposition")
					?.match(/filename="(.+?)"/)?.[1] ??
				`intimera-data-export-${new Date().toISOString().split("T")[0]}.json`;
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err: any) {
			setExportError(err.message);
		} finally {
			setIsExporting(false);
		}
	};

	const handleDelete = () => {
		startDeleting(async () => {
			await deleteAccount();
		});
	};

	const deleteWord = t("deleteWord");

	return (
		<div className="space-y-6">
			{/* Data Section Info */}
			<div className="flex items-start gap-3 p-4 bg-terra-50 dark:bg-terra-900/10 border border-terra-200 dark:border-terra-800/40 rounded-xl">
				<Shield className="w-5 h-5 text-terra-500 mt-0.5 shrink-0" aria-hidden="true" />
				<div className="text-sm text-sand-700 dark:text-sand-300">
					<strong className="text-sand-900 dark:text-sand-100">{t("rightsTitle")}</strong>
					<br />
					{t("rightsDescription")}
				</div>
			</div>

			{/* Export Data */}
			<div className="bg-sand-50 dark:bg-sand-900/20 border border-sand-200 dark:border-sand-800 rounded-2xl p-6">
				<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
					<div>
						<h3 className="text-base font-semibold text-sand-900 dark:text-sand-100">
							{t("exportTitle")}
						</h3>
						<p className="text-sm text-sand-500 mt-1 leading-relaxed">
							{t("exportDescription")}
						</p>
						{exportError && (
							<p className="text-sm text-red-500 mt-2" role="alert">
								{exportError}
							</p>
						)}
					</div>
					<Button
						onClick={handleExport}
						disabled={isExporting}
						aria-busy={isExporting}
						className="bg-white hover:bg-sand-100 text-sand-900 border border-sand-200 dark:bg-black dark:hover:bg-sand-900 dark:text-sand-100 dark:border-sand-800 shrink-0"
					>
						{isExporting ? (
							<Loader2 className="w-4 h-4 me-2 animate-spin" aria-hidden="true" />
						) : (
							<Download className="w-4 h-4 me-2" aria-hidden="true" />
						)}
						{isExporting ? t("exporting") : t("exportButton")}
					</Button>
				</div>
			</div>

			{/* Delete Account */}
			<div className="border border-red-200 dark:border-red-900/50 rounded-2xl p-6">
				<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
					<div>
						<h3 className="text-base font-semibold text-red-600 dark:text-red-400">
							{t("deleteTitle")}
						</h3>
						<p className="text-sm text-sand-500 mt-1 leading-relaxed">
							{t("deleteDescription")}
						</p>
					</div>
					<Button
						onClick={() => setShowDeleteConfirm(true)}
						variant="destructive"
						className="shrink-0"
					>
						<Trash2 className="w-4 h-4 me-2" aria-hidden="true" />
						{t("deleteButton")}
					</Button>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteConfirm && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label={t("confirmTitle")}
					className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
				>
					<div className="bg-white dark:bg-sand-950 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-sand-200 dark:border-sand-800">
						<div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
							<AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" aria-hidden="true" />
						</div>
						<h3 className="text-xl font-semibold text-sand-900 dark:text-sand-100 mb-2">
							{t("confirmTitle")}
						</h3>
						<p className="text-sand-600 dark:text-sand-400 mb-6 leading-relaxed text-sm">
							{t("confirmWarning")}
						</p>
						<ul className="text-sm text-sand-600 dark:text-sand-400 mb-6 space-y-1 list-disc list-inside">
							<li>{t("confirmList1")}</li>
							<li>{t("confirmList2")}</li>
							<li>{t("confirmList3")}</li>
							<li>{t("confirmList4")}</li>
						</ul>

						{/* Type-to-confirm */}
						<label className="block text-sm font-medium text-sand-700 dark:text-sand-300 mb-2">
							{t.rich("typeToDelete", { 
								word: (chunks) => <strong key="delete-word">{chunks}</strong> 
							})}
						</label>
						<input
							type="text"
							value={confirmText}
							onChange={(e) => setConfirmText(e.target.value)}
							placeholder={deleteWord}
							className="w-full px-4 py-2.5 rounded-xl border border-sand-300 dark:border-sand-700 bg-white dark:bg-black text-sand-900 dark:text-sand-100 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
							aria-label={t("typeToDelete", { word: deleteWord })}
						/>

						<div className="flex gap-3">
							<Button
								onClick={() => {
									setShowDeleteConfirm(false);
									setConfirmText("");
								}}
								disabled={isDeleting}
								className="flex-1 bg-sand-100 hover:bg-sand-200 text-sand-900 dark:bg-sand-800 dark:hover:bg-sand-700 dark:text-sand-100"
							>
								{t("cancel")}
							</Button>
							<Button
								onClick={handleDelete}
								disabled={isDeleting || confirmText !== deleteWord}
								variant="destructive"
								className="flex-1"
								aria-disabled={isDeleting || confirmText !== deleteWord}
							>
								{isDeleting ? (
									<Loader2 className="w-4 h-4 me-2 animate-spin" aria-hidden="true" />
								) : (
									<Trash2 className="w-4 h-4 me-2" aria-hidden="true" />
								)}
								{isDeleting ? t("deleting") : t("deleteForever")}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
