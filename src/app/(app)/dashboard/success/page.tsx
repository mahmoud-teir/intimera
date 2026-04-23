"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const sessionId = searchParams.get("session_id");
	const [isValidating, setIsValidating] = useState(true);

	useEffect(() => {
		if (!sessionId) {
			router.push("/dashboard");
			return;
		}

		// Simulate validation wait to allow webhook to process
		const timer = setTimeout(() => {
			setIsValidating(false);
			
			// Fire confetti
			const duration = 3 * 1000;
			const animationEnd = Date.now() + duration;
			const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

			const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

			const interval: any = setInterval(function() {
				const timeLeft = animationEnd - Date.now();

				if (timeLeft <= 0) {
					return clearInterval(interval);
				}

				const particleCount = 50 * (timeLeft / duration);
				confetti({
					...defaults, particleCount,
					origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
				});
				confetti({
					...defaults, particleCount,
					origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
				});
			}, 250);
			
		}, 1500);

		return () => clearTimeout(timer);
	}, [sessionId, router]);

	if (isValidating) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center">
				<div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
				<h2 className="text-xl font-medium text-slate-700 dark:text-slate-300">Confirming your subscription...</h2>
			</div>
		);
	}

	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
			<div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-8 mx-auto shadow-xl shadow-green-500/10">
				<CheckCircle2 className="w-12 h-12" />
			</div>
			
			<h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
				Welcome to Premium!
			</h1>
			
			<p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10">
				Your subscription has been activated successfully. You now have full access to Intimera's advanced wellness tools, community features, and personalized insights.
			</p>
			
			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Link 
					href="/community"
					className="px-8 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-sm"
				>
					Explore the Community
				</Link>
				<Link 
					href="/dashboard"
					className="px-8 py-3 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center"
				>
					Go to Dashboard
					<ArrowRight className="w-4 h-4 ml-2" />
				</Link>
			</div>
		</div>
	);
}
