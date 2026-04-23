"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useId } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
	{
		question: "How secure is the platform?",
		answer: "Your privacy is our highest priority. All data, especially your practice exercises and communication with your partner, is encrypted. We do not sell your data.",
	},
	{
		question: "Can I use Intimera alone, or do I need my partner?",
		answer: "The platform is designed primarily for couples to connect, but individuals can still benefit significantly from the educational library and solo self-discovery exercises.",
	},
	{
		question: "Is the content created by professionals?",
		answer: "Yes, our content is authored and reviewed by licensed therapists, sex educators, and psychologists to ensure it is science-backed and safe.",
	},
	{
		question: "How do the shared exercises work?",
		answer: "One partner initiates an exercise (e.g., a questionnaire about desires), answers their part privately, and invites the other. Answers are only revealed when both partners have completed it, creating a safe, no-pressure environment.",
	},
];

function FAQItem({ faq, index, isOpen, onToggle }: {
	faq: typeof faqs[0];
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
					className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-terra-500 rounded-2xl"
				>
					<span className="text-lg font-medium text-sand-800 dark:text-sand-100">{faq.question}</span>
					<ChevronDown 
						className={`w-5 h-5 text-sand-500 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? "rotate-180" : ""}`}
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

export function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

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
						Common Questions
					</motion.h2>
				</div>

				<dl className="max-w-3xl mx-auto space-y-4">
					{faqs.map((faq, index) => (
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
