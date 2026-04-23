"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";



function FAQItem({ faq, index, isOpen, onToggle }: {
	faq: { question: string; answer: string };
	index: number;
	isOpen: boolean;
	onToggle: () => void;
}) {
	const panelId = useId();
	const headingId = useId();

	return (
		<motion.div
			key={index}
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className="border border-sand-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white/50 dark:bg-black/20 backdrop-blur-sm"
		>
			<h3>
				<button
					id={headingId}
					type="button"
					onClick={onToggle}
					aria-expanded={isOpen}
					aria-controls={panelId}
					className="w-full px-6 py-5 flex items-center justify-between text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terra-500 rounded-2xl"
				>
					<span className="text-lg font-medium text-sand-800 dark:text-sand-100">{faq.question}</span>
					<ChevronDown 
						className={`w-5 h-5 text-sand-500 transition-transform duration-300 flex-shrink-0 ms-4 ${isOpen ? "rotate-180" : ""}`}
						aria-hidden="true"
					/>
				</button>
			</h3>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						id={panelId}
						role="region"
						aria-labelledby={headingId}
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<div className="px-6 pb-5 pt-0 text-sand-600 dark:text-sand-400 leading-relaxed">
							{faq.answer}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

import { useTranslations } from "next-intl";

export function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const t = useTranslations("marketing.faq");
	const tCommon = useTranslations("common");
	const brand = tCommon("brandName");

	const faqData = [
		{ question: t("q1"), answer: t("a1") },
		{ question: t("q2", { brand }), answer: t("a2") },
		{ question: t("q3"), answer: t("a3") },
		{ question: t("q4"), answer: t("a4") },
	];

	return (
		<section className="py-24 bg-white dark:bg-obsidian/30 relative" aria-labelledby="faq-heading">
			<div className="container mx-auto px-4 md:px-6">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<motion.h2 
						id="faq-heading"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-3xl md:text-5xl font-light tracking-tight text-sand-900 dark:text-sand-100 mb-4"
					>
						{t("title")}
					</motion.h2>
				</div>

				<dl className="max-w-3xl mx-auto space-y-4">
					{faqData.map((faq, index) => (
						<FAQItem
							key={index}
							faq={faq}
							index={index}
							isOpen={openIndex === index}
							onToggle={() => setOpenIndex(openIndex === index ? null : index)}
						/>
					))}
				</dl>
			</div>
		</section>
	);
}
