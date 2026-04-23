"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, ChevronDown, ChevronUp } from "lucide-react";
import { getConsent, setConsent, type ConsentStatus } from "@/lib/analytics/consent";
import { initPostHog } from "@/lib/analytics/posthog";
import { useTranslations } from "next-intl";

export function ConsentBanner() {
	const [status, setStatus] = useState<ConsentStatus>("pending");
	const [showDetails, setShowDetails] = useState(false);
	const [mounted, setMounted] = useState(false);
	const t = useTranslations("consent");

	useEffect(() => {
		setMounted(true);
		setStatus(getConsent());
	}, []);

	// Don't show until mounted (avoids SSR mismatch) and only if consent not yet given
	if (!mounted || status !== "pending") return null;

	const handleAccept = () => {
		setConsent("granted");
		setStatus("granted");
		initPostHog(); // Initialize PostHog immediately after consent
	};

	const handleDecline = () => {
		setConsent("denied");
		setStatus("denied");
	};

	return (
		<AnimatePresence>
			<motion.div
				role="dialog"
				aria-modal="false"
				aria-label={t("title")}
				aria-live="polite"
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				exit={{ y: 100, opacity: 0 }}
				transition={{ type: "spring", damping: 25, stiffness: 300 }}
				className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50"
			>
				<div className="bg-white dark:bg-slate-900 border border-sand-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
					{/* Header */}
					<div className="flex items-start gap-3 p-5 pb-4">
						<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-terra-400 to-terra-600 flex items-center justify-center shrink-0 mt-0.5">
							<Shield className="w-4 h-4 text-white" aria-hidden="true" />
						</div>
						<div className="flex-1 min-w-0">
							<h2 className="font-semibold text-sand-900 dark:text-sand-100 text-base mb-0.5">
								{t("title")}
							</h2>
							<p className="text-sm text-sand-600 dark:text-sand-400 leading-relaxed">
								{t.rich("description", {
									highlight: (chunks) => (
										<strong className="text-sand-800 dark:text-sand-200">{chunks}</strong>
									),
								})}
							</p>
						</div>
					</div>

					{/* Details toggle */}
					<button
						type="button"
						onClick={() => setShowDetails(!showDetails)}
						className="flex items-center gap-1.5 px-5 pb-2 text-xs text-sand-500 dark:text-sand-400 hover:text-terra-500 transition-colors"
						aria-expanded={showDetails}
					>
						{showDetails ? (
							<ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
						) : (
							<ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
						)}
						{showDetails ? t("hideDetails") : t("showDetails")}
					</button>

					<AnimatePresence>
						{showDetails && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="overflow-hidden"
							>
								<ul className="px-5 pb-3 space-y-1.5 text-xs text-sand-600 dark:text-sand-400">
									{[
										`✓  ${t("item1")}`,
										`✓  ${t("item2")}`,
										`✓  ${t("item3")}`,
										`✗  ${t("item4")}`,
										`✗  ${t("item5")}`,
									].map((item) => (
										<li key={item} className={item.startsWith("✗") ? "text-red-500 dark:text-red-400" : ""}>
											{item}
										</li>
									))}
								</ul>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Actions */}
					<div className="flex items-center gap-2 px-5 pb-5">
						<button
							type="button"
							onClick={handleDecline}
							className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-sand-600 dark:text-sand-400 border border-sand-200 dark:border-slate-700 hover:bg-sand-50 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-500"
						>
							{t("decline")}
						</button>
						<button
							type="button"
							onClick={handleAccept}
							className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 transition-all shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-terra-500"
						>
							{t("accept")}
						</button>
					</div>

					{/* Dismiss without deciding */}
					<button
						type="button"
						onClick={() => setStatus("denied")} // Treat dismiss as temporary decline
						className="absolute top-4 right-4 p-1 rounded-lg text-sand-400 hover:text-sand-600 dark:hover:text-sand-200 transition-colors"
						aria-label={t("decline")}
					>
						<X className="w-4 h-4" aria-hidden="true" />
					</button>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
