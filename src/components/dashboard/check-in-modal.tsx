"use client";

import { useState, useTransition, useId, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Smile, Activity, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitCheckIn } from "@/actions/check-in";
import { useTranslations } from "next-intl";

interface CheckInModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CheckInModal({ isOpen, onClose }: CheckInModalProps) {
	const [moodScore, setMoodScore] = useState(3);
	const [connectionScore, setConnectionScore] = useState(3);
	const [notes, setNotes] = useState("");
	
	const [isPending, startTransition] = useTransition();
	const [isSuccess, setIsSuccess] = useState(false);

	// Unique IDs for ARIA associations
	const titleId = useId();
	const moodId = useId();
	const connectionId = useId();
	const notesId = useId();

	// Trap focus inside the modal and restore on close
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		if (isOpen) {
			// Delay focus to allow animation to begin
			const timer = setTimeout(() => closeButtonRef.current?.focus(), 50);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	// Close on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	const t = useTranslations("checkIn");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		const formData = new FormData();
		formData.append("moodScore", moodScore.toString());
		formData.append("connectionScore", connectionScore.toString());
		formData.append("notes", notes);

		startTransition(async () => {
			const res = await submitCheckIn(formData);
			if (res.success) {
				setIsSuccess(true);
				setTimeout(() => {
					onClose();
					setIsSuccess(false);
					setMoodScore(3);
					setConnectionScore(3);
					setNotes("");
				}, 2000);
			} else {
				alert(res.error || t("submitError"));
			}
		});
	};

	// Respect prefers-reduced-motion
	const motionProps = {
		initial: { opacity: 0, scale: 0.95, y: 20 },
		animate: { opacity: 1, scale: 1, y: 0 },
		exit: { opacity: 0, scale: 0.95, y: 20 },
		transition: { type: "spring" as const, damping: 25, stiffness: 300 },
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div 
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						aria-hidden="true"
						className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
					/>
					
					{/* Modal */}
					<div
						className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
					>
						<motion.div 
							{...motionProps}
							role="dialog"
							aria-modal="true"
							aria-labelledby={titleId}
							className="w-full max-w-lg bg-white dark:bg-black border border-sand-200 dark:border-sand-800 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden relative"
						>
							<button 
								ref={closeButtonRef}
								type="button"
								onClick={onClose}
								aria-label={t("closeLabel")}
								className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 bg-white/50 dark:bg-black/50 p-2 rounded-full transition-colors z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-500"
							>
								<X className="w-5 h-5" aria-hidden="true" />
							</button>

							{isSuccess ? (
								<div
									className="py-24 px-10 flex flex-col items-center justify-center text-center"
									role="status"
									aria-live="polite"
								>
									<motion.div 
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="w-20 h-20 bg-sage-100 dark:bg-sage-900/50 rounded-full flex items-center justify-center mb-6"
									>
										<CheckCircle2 className="w-10 h-10 text-sage-600 dark:text-sage-400" aria-hidden="true" />
									</motion.div>
									<h2 id={titleId} className="text-2xl font-light text-sand-900 dark:text-sand-100 mb-2">
										{t("successTitle")}
									</h2>
									<p className="text-sand-600 dark:text-sand-400">
										{t("successDescription")}
									</p>
								</div>
							) : (
								<div className="p-8 sm:p-10">
									<div className="flex items-center space-x-3 rtl:space-x-reverse mb-8">
										<div className="w-12 h-12 bg-terra-100 dark:bg-terra-900/30 rounded-2xl flex items-center justify-center" aria-hidden="true">
											<Heart className="w-6 h-6 text-terra-500 fill-terra-500/20" />
										</div>
										<div>
											<h2 id={titleId} className="text-2xl font-light tracking-tight text-sand-900 dark:text-sand-100">
												{t("title")}
											</h2>
											<p className="text-sand-500 text-sm mt-1">
												{t("description")}
											</p>
										</div>
									</div>

									<form onSubmit={handleSubmit} className="space-y-8" noValidate>
										
										{/* Mood Score */}
										<div className="space-y-4">
											<div className="flex justify-between items-center text-sm font-medium text-sand-700 dark:text-sand-300">
												<label htmlFor={moodId} className="flex items-center cursor-pointer">
													<Smile className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" aria-hidden="true" />
													{t("moodLabel")}
												</label>
												<span aria-live="polite" aria-atomic="true" className="text-terra-500 text-lg">{moodScore}/5</span>
											</div>
											<input 
												id={moodId}
												type="range" 
												min="1" 
												max="5" 
												step="1"
												value={moodScore} 
												onChange={(e) => setMoodScore(parseInt(e.target.value))}
												aria-valuemin={1}
												aria-valuemax={5}
												aria-valuenow={moodScore}
												aria-valuetext={t("moodValueText", { score: moodScore })}
												className="w-full h-2 bg-sand-100 dark:bg-sand-900/50 rounded-lg appearance-none cursor-pointer accent-terra-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-500"
											/>
											<div className="flex justify-between text-xs text-sand-500" aria-hidden="true">
												<span>{t("moodMinLabel")}</span>
												<span>{t("moodMaxLabel")}</span>
											</div>
										</div>

										{/* Connection Score */}
										<div className="space-y-4">
											<div className="flex justify-between items-center text-sm font-medium text-sand-700 dark:text-sand-300">
												<label htmlFor={connectionId} className="flex items-center cursor-pointer">
													<Activity className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" aria-hidden="true" />
													{t("connectionLabel")}
												</label>
												<span aria-live="polite" aria-atomic="true" className="text-terra-500 text-lg">{connectionScore}/5</span>
											</div>
											<input 
												id={connectionId}
												type="range" 
												min="1" 
												max="5" 
												step="1"
												value={connectionScore} 
												onChange={(e) => setConnectionScore(parseInt(e.target.value))}
												aria-valuemin={1}
												aria-valuemax={5}
												aria-valuenow={connectionScore}
												aria-valuetext={t("connectionValueText", { score: connectionScore })}
												className="w-full h-2 bg-sand-100 dark:bg-sand-900/50 rounded-lg appearance-none cursor-pointer accent-terra-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-500"
											/>
											<div className="flex justify-between text-xs text-sand-500" aria-hidden="true">
												<span>{t("connectionMinLabel")}</span>
												<span>{t("connectionMaxLabel")}</span>
											</div>
										</div>

										{/* Notes */}
										<div className="space-y-3">
											<label
												htmlFor={notesId}
												className="text-sm font-medium text-sand-700 dark:text-sand-300"
											>
												{t("notesLabel")} <span className="text-sand-400 font-normal">{t("notesOptional")}</span>
											</label>
											<Textarea 
												id={notesId}
												value={notes}
												onChange={(e) => setNotes(e.target.value)}
												placeholder={t("notesPlaceholder")}
												className="resize-none bg-white/50 dark:bg-black/20 border-sand-200 dark:border-sand-800 rounded-xl focus-visible:ring-terra-500 min-h-[100px]"
											/>
										</div>

										<Button 
											type="submit" 
											disabled={isPending}
											className="w-full bg-terra-500 hover:bg-terra-600 text-white rounded-xl h-12 text-base font-medium transition-transform active:scale-[0.98]"
											aria-busy={isPending}
										>
											{isPending ? (
												<>
													<Loader2 className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" aria-hidden="true" />
													<span>{t("saving")}</span>
												</>
											) : (
												t("saveButton")
											)}
										</Button>

									</form>
								</div>
							)}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}
