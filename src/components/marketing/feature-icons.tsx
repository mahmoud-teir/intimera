"use client";

import { cn } from "@/lib/utils";

interface IconProps {
	className?: string;
}

export function DailyCheckinsIcon({ className }: IconProps) {
	return (
		<svg 
			viewBox="0 0 32 32" 
			fill="none" 
			xmlns="http://www.w3.org/2000/svg" 
			className={cn("w-full h-full", className)}
		>
			<circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" className="opacity-30" />
			<path 
				d="M16 4C12.5 4 9.5 5.5 7.5 8C5.5 10.5 4.5 14 5 17.5C5.5 21 7.5 24 10.5 26C13.5 28 17.5 28.5 21 27C24.5 25.5 27 22.5 27.5 19C28 15.5 27 12 25 9.5C23 7 20 5 16.5 4.5" 
				stroke="currentColor" 
				strokeWidth="2" 
				strokeLinecap="round" 
				strokeLinejoin="round" 
			/>
			<path 
				d="M16 12C18.2091 12 20 13.7909 20 16C20 18.2091 18.2091 20 16 20C13.7909 20 12 18.2091 12 16C12 13.7909 13.7909 12 16 12Z" 
				fill="currentColor" 
				className="animate-pulse"
				fillOpacity="0.3"
			/>
			<path d="M16 8V6M24 16H26M16 24V26M8 16H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}

export function AIAdvisorIcon({ className }: IconProps) {
	return (
		<svg 
			viewBox="0 0 32 32" 
			fill="none" 
			xmlns="http://www.w3.org/2000/svg" 
			className={cn("w-full h-full", className)}
		>
			<path 
				d="M16 4L19 13H28L21 19L24 28L16 22L8 28L11 19L4 13H13L16 4Z" 
				stroke="currentColor" 
				strokeWidth="1.5" 
				strokeLinejoin="round" 
				className="opacity-20"
			/>
			<path 
				d="M16 7L18.5 14.5L26 17L18.5 19.5L16 27L13.5 19.5L6 17L13.5 14.5L16 7Z" 
				stroke="currentColor" 
				strokeWidth="2" 
				strokeLinecap="round" 
				strokeLinejoin="round" 
			/>
			<circle cx="16" cy="17" r="2.5" fill="currentColor" />
			<path 
				d="M16 11V13M21 16H23M16 21V23M11 16H9" 
				stroke="currentColor" 
				strokeWidth="1.2" 
				strokeLinecap="round" 
			/>
		</svg>
	);
}

export function PrivateExercisesIcon({ className }: IconProps) {
	return (
		<svg 
			viewBox="0 0 32 32" 
			fill="none" 
			xmlns="http://www.w3.org/2000/svg" 
			className={cn("w-full h-full", className)}
		>
			<path 
				d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" 
				stroke="currentColor" 
				strokeWidth="1.5" 
				className="opacity-20"
			/>
			<path 
				d="M12 12C12 12 14 10 16 10C18 10 20 12 20 12C20 12 22 14 22 16C22 18 20 20 20 20C20 20 18 22 16 22C14 22 12 20 12 20C12 20 10 18 10 16C10 14 12 12 12 12Z" 
				stroke="currentColor" 
				strokeWidth="2" 
				strokeLinecap="round" 
				strokeLinejoin="round" 
			/>
			<path 
				d="M16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19C14.3431 19 13 17.6569 13 16C13 14.3431 14.3431 13 16 13Z" 
				fill="currentColor" 
				fillOpacity="0.4"
			/>
			<path d="M16 4V8M28 16H24M16 28V24M4 16H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
		</svg>
	);
}
