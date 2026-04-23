"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface LogoProps {
	className?: string;
	showText?: boolean;
	size?: "sm" | "md" | "lg" | "xl";
	variant?: "default" | "white" | "gradient";
}

export function Logo({ 
	className, 
	showText = true, 
	size = "md", 
	variant = "default" 
}: LogoProps) {
	const sizes = {
		sm: { icon: 24, font: "text-lg" },
		md: { icon: 32, font: "text-2xl" },
		lg: { icon: 40, font: "text-3xl" },
		xl: { icon: 56, font: "text-5xl" },
	};

	const t = useTranslations("common");
	const { icon, font } = sizes[size];

	return (
		<div className={cn("flex items-center gap-3 select-none", className)}>
			{/* SVG Mark */}
			<svg 
				width={icon} 
				height={icon} 
				viewBox="0 0 32 32" 
				fill="none" 
				xmlns="http://www.w3.org/2000/svg"
				className="shrink-0"
			>
				<defs>
					<linearGradient id="logoGradient" x1="4" y1="4" x2="28" y2="28">
						<stop offset="0%" stopColor="#D85F3C" />
						<stop offset="100%" stopColor="#548B5A" />
					</linearGradient>
				</defs>
				<path 
					d="M16 28.5C16 28.5 4 19.5 4 11.5C4 5.5 11 3.5 16 8.5C21 3.5 28 5.5 28 11.5C28 19.5 16 28.5 16 28.5Z" 
					fill={variant === "white" ? "white" : "#FAF8F5"} 
				/>
				<path 
					d="M16 28.5C11 24.5 4 18.5 4 11.5C4 7.5 7 4.5 11 4.5C13 4.5 15 5.5 16 8.5C17 5.5 19 4.5 21 4.5C25 4.5 28 7.5 28 11.5C28 18.5 21 24.5 16 28.5Z" 
					stroke={variant === "gradient" ? "url(#logoGradient)" : variant === "white" ? "white" : "url(#logoGradient)"} 
					strokeWidth="2.5" 
					strokeLinecap="round" 
					strokeLinejoin="round" 
				/>
			</svg>

			{/* Typography */}
			{showText && (
				<span className={cn(
					"font-light tracking-[0.1em] transition-colors",
					font,
					variant === "white" ? "text-white" : "text-[--text-base]"
				)}>
					{t("brandName")}<span className="text-terra-500">.</span>
				</span>
			)}
		</div>
	);
}
