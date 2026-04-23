"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// In a real application, you might want to log this to an error reporting service like Sentry
		console.error("Application Error Boundary caught an error:", error);
	}, [error]);

	return (
		<div className="min-h-screen bg-sand-50 dark:bg-black text-sand-900 dark:text-sand-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
			{/* Ambient Background */}
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
				<div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-red-500/5 dark:bg-red-500/5 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
			</div>

			<div className="relative z-10 flex flex-col items-center text-center max-w-md w-full bg-white/40 dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-lg">
				<div className="w-20 h-20 mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center relative">
					<div className="absolute inset-0 rounded-full border-2 border-red-500/20 animate-ping opacity-20" />
					<AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
				</div>
				
				<h1 className="text-2xl md:text-3xl font-light tracking-tight mb-3">
					Something went wrong
				</h1>
				
				<p className="text-sand-600 dark:text-sand-400 mb-8 font-light text-sm md:text-base leading-relaxed">
					We encountered an unexpected issue while loading this page. Our systems have noted the error, but you can try again.
				</p>

				<div className="w-full space-y-3">
					<Button 
						onClick={() => reset()}
						className="w-full h-12 bg-terra-500 hover:bg-terra-600 text-white rounded-xl shadow-md transition-all text-base group"
					>
						<RefreshCcw className="w-4 h-4 mr-2 group-hover:-rotate-180 transition-transform duration-500" />
						Try Again
					</Button>
					
					<Link 
						href="/dashboard" 
						className="w-full flex items-center justify-center h-12 rounded-xl text-base border border-sand-200 dark:border-sand-800 bg-transparent hover:bg-black/5 dark:hover:bg-white/5 font-medium transition-colors"
					>
						<Home className="w-4 h-4 mr-2" />
						Return to Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}
