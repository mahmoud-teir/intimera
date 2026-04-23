import { PricingCards } from "@/components/marketing/pricing-cards";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("marketing.pricing");
	const tCommon = await getTranslations("common");
	return {
		title: `${tCommon("brandName")} | Pricing`,
		description: t("subheadline"),
	};
}

export default async function PricingPage() {
	const session = await auth.api.getSession({
		headers: await headers()
	});
	
	const t = await getTranslations("marketing.pricing");
	const tCommon = await getTranslations("common");
	const tNav = await getTranslations("nav");
	const tAuth = await getTranslations("auth");
	const tFaq = await getTranslations("faq");

	const brand = tCommon("brandName");

	return (
		<div className="flex flex-col min-h-screen">
			{/* Minimal Marketing Nav */}
			<nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-30">
				<div className="container mx-auto px-4 h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2 font-semibold text-slate-900 dark:text-white">
						<Heart className="w-5 h-5 text-indigo-500" />
						<span>{brand}</span>
					</Link>
					<div className="flex items-center space-x-4">
						{session?.user ? (
							<Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
								{tNav("dashboard")}
							</Link>
						) : (
							<>
								<Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
									{tAuth("signIn")}
								</Link>
								<Link href="/register" className="text-sm font-medium px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
									{tAuth("signUp")}
								</Link>
							</>
						)}
					</div>
				</div>
			</nav>
			
			<main className="flex-1 bg-slate-50 dark:bg-[#0A0A0A] pt-24 pb-32">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
							{t.rich("headline", {
								highlight: (chunks) => <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">{chunks}</span>
							})}
						</h1>
						<p className="text-lg text-slate-600 dark:text-slate-400">
							{t("subheadline")}
						</p>
					</div>

					<PricingCards isAuthenticated={!!session?.user} />

					{/* FAQ Section */}
					<div className="max-w-3xl mx-auto mt-32">
						<h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
							{tFaq("title")}
						</h2>
						<div className="space-y-8">
							{[5, 6, 7].map((i) => (
								<div key={i}>
									<h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
										{tFaq(`q${i}` as any)}
									</h4>
									<p className="text-slate-600 dark:text-slate-400">
										{tFaq(`a${i}` as any, { brand })}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</main>
			
			{/* Footer */}
			<footer className="border-t border-slate-200 dark:border-slate-800 py-8">
				<div className="container mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
					© {new Date().getFullYear()} {brand}. {tCommon("rightsReserved" as any) || "All rights reserved."}
				</div>
			</footer>
		</div>
	);
}
