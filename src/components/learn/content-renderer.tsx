"use client";

import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { updateReadingProgress } from "@/actions/progress";

interface ContentRendererProps {
	contentId: string;
	markdown: string;
}

export function ContentRenderer({ contentId, markdown }: ContentRendererProps) {
	const [scrollProgress, setScrollProgress] = useState(0);
	const reportedMilestones = useRef(new Set<number>());
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (!contentRef.current) return;
			
			// Calculate how far down the content the user has scrolled
			const { top, bottom, height } = contentRef.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			
			// If top is below the viewport, progress is 0
			if (top > windowHeight) {
				setScrollProgress(0);
				return;
			}
			
			// If bottom is above the viewport, progress is 100%
			if (bottom < 0) {
				setScrollProgress(100);
				reportMilestone(100);
				return;
			}
			
			// Calculate percentage
			// The readable distance is the height of the content minus the window height
			// The scrolled distance is how far the top has moved past the viewport
			const scrolledDistance = windowHeight - top;
			const totalReadableDistance = height;
			
			let percentage = Math.max(0, Math.min(100, Math.round((scrolledDistance / totalReadableDistance) * 100)));
			
			setScrollProgress(percentage);
			
			// Check for milestones (25, 50, 75, 100)
			if (percentage >= 25 && !reportedMilestones.current.has(25)) reportMilestone(25);
			if (percentage >= 50 && !reportedMilestones.current.has(50)) reportMilestone(50);
			if (percentage >= 75 && !reportedMilestones.current.has(75)) reportMilestone(75);
			if (percentage >= 100 && !reportedMilestones.current.has(100)) reportMilestone(100);
		};

		const reportMilestone = (milestone: number) => {
			reportedMilestones.current.add(milestone);
			updateReadingProgress(contentId, milestone);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		// Trigger once on mount to handle short articles
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [contentId]);

	return (
		<>
			{/* Progress Bar fixed to top of viewport */}
			<div className="fixed top-16 left-0 w-full h-1 bg-transparent z-40">
				<div 
					className="h-full bg-terra-500 transition-all duration-150 ease-out"
					style={{ width: `${scrollProgress}%` }}
				/>
			</div>

			<div 
				ref={contentRef}
				className="prose prose-sand dark:prose-invert prose-lg max-w-none 
				prose-headings:font-light prose-headings:tracking-tight prose-a:text-terra-600 dark:prose-a:text-terra-400 
				prose-img:rounded-2xl prose-img:shadow-md"
			>
				<ReactMarkdown 
					remarkPlugins={[remarkGfm]}
					components={{
						// Automatically add IDs to h2 and h3 for the Table of Contents
						h2: ({ node, ...props }) => {
							const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
							return <h2 id={id} className="scroll-m-24" {...props} />;
						},
						h3: ({ node, ...props }) => {
							const id = props.children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
							return <h3 id={id} className="scroll-m-24" {...props} />;
						}
					}}
				>
					{markdown}
				</ReactMarkdown>
			</div>
		</>
	);
}
