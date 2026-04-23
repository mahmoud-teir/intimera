"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/actions/stripe";
import { useRouter } from "next/navigation";

interface PricingCardsProps {
	isAuthenticated: boolean;
}

export function PricingCards({ isAuthenticated }: PricingCardsProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<string | null>(null);

	const handleSubscribe = async (tier: string, priceId?: string) => {
		if (!isAuthenticated) {
			router.push(`/login?returnTo=/pricing`);
			return;
		}

		if (!priceId) return;

		setIsLoading(tier);
		
		const result = await createCheckoutSession(priceId);
		
		if (result.success && result.url) {
			window.location.href = result.url;
		} else {
			alert(result.error || "Failed to initiate checkout. Please try again.");
			setIsLoading(null);
		}
	};

	const tiers = [
		{
			id: "FREE",
			name: "Basic",
			price: "$0",
			description: "Essential tools for personal growth.",
			features: [
				"Access to basic wellness library",
				"Read-only community access",
				"Standard relationship assessments",
			],
			buttonText: isAuthenticated ? "Current Plan" : "Get Started for Free",
			action: () => isAuthenticated ? router.push("/dashboard") : router.push("/login"),
			priceId: null,
			popular: false,
		},
		{
			id: "PREMIUM",
			name: "Premium",
			price: "$9.99",
			period: "/month",
			description: "Full access to advanced features and community participation.",
			features: [
				"Everything in Basic",
				"Full Community Forum posting & replying",
				"Unlimited AI Wellness Advisor chats",
				"Advanced personalized insights",
				"Premium guided exercises",
			],
			buttonText: "Upgrade to Premium",
			// Replace with actual price ID in production
			priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || "price_premium_placeholder",
			popular: true,
		},
		{
			id: "COUPLES",
			name: "Couples",
			price: "$14.99",
			period: "/month",
			description: "Connect with your partner for shared wellness journey.",
			features: [
				"Everything in Premium",
				"Link accounts with your partner",
				"Shared relationship timeline",
				"Couples-specific assessments",
				"Joint exercises and prompts",
			],
			buttonText: "Upgrade to Couples",
			// Replace with actual price ID in production
			priceId: process.env.NEXT_PUBLIC_STRIPE_COUPLES_PRICE_ID || "price_couples_placeholder",
			popular: false,
		}
	];

	return (
		<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
			{tiers.map((tier) => (
				<div 
					key={tier.id}
					className={`relative flex flex-col p-8 rounded-3xl bg-white dark:bg-slate-900 border ${
						tier.popular 
							? "border-indigo-500 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-900/20 md:-translate-y-4" 
							: "border-slate-200 dark:border-slate-800"
					} transition-transform`}
				>
					{tier.popular && (
						<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
							Most Popular
						</div>
					)}
					
					<div className="mb-8">
						<h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{tier.name}</h3>
						<p className="text-slate-500 text-sm h-10">{tier.description}</p>
					</div>

					<div className="mb-8">
						<div className="flex items-baseline text-slate-900 dark:text-white">
							<span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
							{tier.period && (
								<span className="text-slate-500 font-medium ml-1">{tier.period}</span>
							)}
						</div>
					</div>

					<ul className="flex-1 space-y-4 mb-8">
						{tier.features.map((feature, i) => (
							<li key={i} className="flex items-start">
								<Check className="w-5 h-5 text-indigo-500 mr-3 shrink-0" />
								<span className="text-slate-600 dark:text-slate-300 text-sm">{feature}</span>
							</li>
						))}
					</ul>

					<button
						onClick={() => tier.priceId ? handleSubscribe(tier.id, tier.priceId) : (tier as any).action?.()}
						disabled={isLoading === tier.id || (isAuthenticated && tier.id === "FREE")}
						className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-colors ${
							tier.popular
								? "bg-indigo-600 text-white hover:bg-indigo-700"
								: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
						} disabled:opacity-50`}
					>
						{isLoading === tier.id ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							tier.buttonText
						)}
					</button>
				</div>
			))}
		</div>
	);
}
