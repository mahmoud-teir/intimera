"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface TocItem {
	id: string;
	text: string;
	level: number;
}

export function TableOfContents({ markdown }: { markdown: string }) {
	const [activeId, setActiveId] = useState<string>("");
	const [headings, setHeadings] = useState<TocItem[]>([]);
	const t = useTranslations("library");

	useEffect(() => {
		// Extract h2 and h3 headings from the markdown
		const regex = /^(##|###)\s+(.+)$/gm;
		const extractedHeadings: TocItem[] = [];
		let match;

		while ((match = regex.exec(markdown)) !== null) {
			const level = match[1].length; // 2 or 3
			const text = match[2].trim();
			// Replicate the ID generation logic used in ContentRenderer
			const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
			
			extractedHeadings.push({ id, text, level });
		}
		
		setHeadings(extractedHeadings);
	}, [markdown]);

	useEffect(() => {
		if (headings.length === 0) return;

		// Use IntersectionObserver to highlight current section
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{ rootMargin: "0px 0px -80% 0px" } // Trigger near the top
		);

		headings.forEach((heading) => {
			const element = document.getElementById(heading.id);
			if (element) observer.observe(element);
		});

		return () => observer.disconnect();
	}, [headings]);

	if (headings.length === 0) return null;

	return (
		<div className="sticky top-24">
			<h4 className="text-sm font-semibold text-sand-900 dark:text-sand-100 mb-4 uppercase tracking-wider">
				{t("toc")}
			</h4>
			<nav className="space-y-1">
				{headings.map((heading) => {
					const isActive = activeId === heading.id;
					return (
						<a
							key={heading.id}
							href={`#${heading.id}`}
							className={`
								group flex items-center py-1.5 text-sm transition-colors
								${heading.level === 3 ? "ps-4" : ""}
								${isActive 
									? "text-terra-600 dark:text-terra-400 font-medium" 
									: "text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-200"
								}
							`}
						>
							{isActive && <ChevronRight className="w-3 h-3 me-1 text-terra-500 rtl:rotate-180" />}
							<span className={`${isActive ? "" : "border-s-2 border-transparent hover:border-sand-300 dark:hover:border-sand-700 ps-2 -ms-2.5"}`}>
								{heading.text}
							</span>
						</a>
					);
				})}
			</nav>
		</div>
	);
}
