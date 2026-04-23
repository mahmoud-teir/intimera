"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
	const t = useTranslations("marketing.hero");
	const tCommon = useTranslations("common");

	return (
		<section
			className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
			style={{
				background:
					"radial-gradient(circle at 20% 20%, rgba(216,95,60,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(84,139,90,0.05) 0%, transparent 50%), var(--bg-base)",
			}}
		>
			{/* Ambient glows */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-terra-500/8 dark:bg-terra-500/5 rounded-full blur-[140px]" />
				<div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-sage-500/6 dark:bg-sage-500/4 rounded-full blur-[120px]" />
			</div>

			<div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
				{/* Eyebrow */}
				<div className="inline-flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-terra-50 dark:bg-terra-500/10 border border-terra-200/40 dark:border-terra-500/20">
					<span className="text-terra-500 text-lg">♡</span>
					<span className="text-sm text-terra-700 dark:text-terra-400 font-medium tracking-wide">
						{t("eyebrow")}
					</span>
				</div>

				{/* Headline */}
				<h1 className="text-6xl md:text-8xl font-light text-[--text-base] tracking-tight leading-[1.05] mb-10">
					{t.rich("headline", {
						highlight: (chunks) => <em className="text-terra-500 not-italic font-light">{chunks}</em>
					})}
				</h1>

				{/* Subtext */}
				<p className="text-xl md:text-2xl text-[--text-muted] font-light leading-relaxed max-w-2xl mx-auto mb-16">
					{t("subtext", { brand: tCommon("brandName") })}
				</p>

				{/* CTAs */}
				<div className="flex flex-col sm:flex-row items-center justify-center gap-5">
					<Link
						href="/register"
						className="flex items-center gap-2 bg-gradient-to-br from-terra-500 to-terra-600 hover:to-terra-700 text-white px-10 py-5 rounded-full font-semibold text-lg transition-all hover:shadow-[0_20px_40px_rgba(216,95,60,0.25)] hover:-translate-y-1"
					>
						{t("ctaStart")}
						<ArrowRight className="w-5 h-5 rtl:rotate-180" />
					</Link>
					<a
						href="#features"
						className="flex items-center gap-2 px-10 py-5 rounded-full font-medium text-sand-900 dark:text-sand-100 bg-sand-100 dark:bg-white/5 hover:bg-sand-200 dark:hover:bg-white/10 transition-all text-lg"
					>
						<Play className="w-4 h-4 fill-current rtl:rotate-180" />
						{t("ctaHow")}
					</a>
				</div>

				{/* Social proof nudge */}
				<div className="mt-16 flex items-center justify-center gap-3 text-sm text-[--text-faint]">
					<div className="flex -space-x-2 rtl:space-x-reverse">
						{["E", "S", "A", "M"].map((initial, i) => (
							<div
								key={i}
								className="w-7 h-7 rounded-full border-2 border-[--bg-base] flex items-center justify-center text-xs text-white font-medium"
								style={{
									background: ["#D85F3C", "#548B5A", "#B8967A", "#8B6F47"][i],
								}}
							>
								{initial}
							</div>
						))}
					</div>
					<span>{t("socialProof")}</span>
				</div>
			</div>
		</section>
	);
}
