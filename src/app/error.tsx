"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		// Log to error reporting service in production
		console.error("Unhandled error:", error);
	}, [error]);

	return (
		<div className="min-h-dvh bg-[--bg-base] flex items-center justify-center px-4">
			<div className="max-w-md w-full text-center">
				{/* Icon */}
				<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
					<AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
				</div>

				<h1 className="text-2xl font-semibold text-primary mb-2">
					Something went wrong
				</h1>
				<p className="text-secondary mb-8 leading-relaxed">
					An unexpected error occurred. Your data is safe — please try again.
				</p>

				{/* Error digest for support */}
				{error.digest && (
					<p className="text-xs text-hint font-mono mb-6 bg-black/10 dark:bg-black/30 rounded-lg px-4 py-2">
						Error ID: {error.digest}
					</p>
				)}

				<div className="flex items-center justify-center gap-3">
					<Button
						onClick={reset}
						className="bg-gradient-to-r from-terra-500 to-terra-600 hover:from-terra-600 hover:to-terra-700 text-white"
					>
						<RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
						Try again
					</Button>
					<a
						href="/dashboard"
						className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-sand-200 dark:border-sand-700 text-sm font-medium text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-900/30 transition-colors"
					>
						Go to dashboard
					</a>
				</div>
			</div>
		</div>
	);
}
