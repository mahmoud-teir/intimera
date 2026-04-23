import { PricingCards } from "@/components/marketing/pricing-cards";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Heart } from "lucide-react";

export const metadata = {
	title: "Pricing | Intimera",
	description: "Invest in your relationship wellness with Intimera Premium.",
};

export default async function PricingPage() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	return (
		<div className="flex flex-col min-h-screen">
			{/* Minimal Marketing Nav */}
			<nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-30">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2 font-semibold text-slate-900 dark:text-white">
						<Heart className="w-5 h-5 text-indigo-500" />
						<span>Intimera</span>
					</Link>
					<div className="flex items-center space-x-4">
						{session?.user ? (
							<Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Dashboard</Link>
						) : (
							<>
								<Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Login</Link>
								<Link href="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">Get Started</Link>
							</>
						)}
					</div>
				</div>
			</nav>
			
			<main className="flex-1 bg-slate-50 dark:bg-[#0A0A0A] pt-24 pb-32">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
							Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Relationship Wellness</span>
						</h1>
						<p className="text-lg text-slate-600 dark:text-slate-400">
							Choose the plan that fits your journey. Whether you're exploring on your own or deepening your connection with a partner, we have you covered.
						</p>
					</div>

					<PricingCards isAuthenticated={!!session?.user} />

					{/* FAQ Section */}
					<div className="max-w-3xl mx-auto mt-32">
						<h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
						<div className="space-y-8">
							<div>
								<h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Can I cancel my subscription at any time?</h4>
								<p className="text-slate-600 dark:text-slate-400">Yes, you can cancel your subscription at any time from your account settings. You'll retain access to premium features until the end of your current billing cycle.</p>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">How does the Couples plan work?</h4>
								<p className="text-slate-600 dark:text-slate-400">The Couples plan allows you to link two Intimera accounts. Both users get full Premium access, plus exclusive features like shared timelines, dual assessments, and joint exercises.</p>
							</div>
							<div>
								<h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Is my data private and secure?</h4>
								<p className="text-slate-600 dark:text-slate-400">Absolutely. Your intimacy data and forum posts are highly protected. Forum posts can be made completely anonymously, and we use industry-standard encryption for all your personal information.</p>
							</div>
						</div>
					</div>
				</div>
			</main>
			
			{/* Footer */}
			<footer className="border-t border-slate-200 dark:border-slate-800 py-8">
				<div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
					© {new Date().getFullYear()} Intimera. All rights reserved.
				</div>
			</footer>
		</div>
	);
}
