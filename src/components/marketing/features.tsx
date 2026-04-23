"use client";

import { Check } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { isRTL, type Locale } from "@/i18n/routing";
import { DailyCheckinsIcon, AIAdvisorIcon, PrivateExercisesIcon } from "./feature-icons";

export function Features() {
	const t = useTranslations("marketing.features");
	const tCommon = useTranslations("common");
	const locale = useLocale();
	const rtl = isRTL(locale as Locale);
	const brand = tCommon("brandName");

	const features = [
		{
			icon: DailyCheckinsIcon,
			color: "terra",
			title: t("dailyCheckins.title"),
			description: t("dailyCheckins.description"),
		},
		{
			icon: AIAdvisorIcon,
			color: "amber",
			title: t("aiAdvisor.title"),
			description: t("aiAdvisor.description"),
		},
		{
			icon: PrivateExercisesIcon,
			color: "sage",
			title: t("privateExercises.title"),
			description: t("privateExercises.description"),
		},
	];


	const testimonials = [
		{
			quote: t("stories.story1.quote", { brand }),
			name: t("stories.story1.name"),
			years: t("stories.story1.years"),
			initials: "E&J",
		},
		{
			quote: t("stories.story2.quote"),
			name: t("stories.story2.name"),
			years: t("stories.story2.years"),
			initials: "S&M",
		},
		{
			quote: t("stories.story3.quote"),
			name: t("stories.story3.name"),
			years: t("stories.story3.years"),
			initials: "A&L",
		},
	];

	return (
		<>
			{/* Features */}
			<section id="features" className="py-40 bg-[--bg-base]">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<div className="text-center mb-24">
						<span className="text-xs tracking-[0.2em] rtl:tracking-normal text-terra-500 uppercase font-bold mb-6 block">
							{t("eyebrow")}
						</span>
						<h2 className="text-5xl md:text-6xl font-light text-[--text-base] tracking-tight leading-tight">
							{t("headline")}
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-16">
						{features.map((f) => {
							const Icon = f.icon;
							return (
								<div key={f.title} className="flex flex-col gap-8 group">
									<div
										className={`w-16 h-16 rounded-3xl flex items-center justify-center bg-sand-100 dark:bg-white/5 transition-all duration-500 group-hover:scale-110 group-hover:bg-sand-200`}
									>
										<Icon className={`w-7 h-7 text-${f.color}-500`} />
									</div>
									<div>
										<h3 className="text-2xl font-light text-[--text-base] mb-4">{f.title}</h3>
										<p className="text-[--text-muted] leading-relaxed text-lg font-light">{f.description}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Sanctuary teaser */}
			<section className="py-24 bg-sand-100/50 dark:bg-obsidian-dim">
				<div className="max-w-6xl mx-auto px-6 lg:px-8">
					<div className="bg-white dark:bg-sanctum rounded-[3.5rem] p-12 md:p-24 shadow-[0_40px_100px_rgba(28,20,16,0.04)] relative overflow-hidden">
						<div className="absolute -bottom-20 -end-20 w-[500px] h-[500px] bg-terra-100/40 dark:bg-terra-500/5 rounded-full blur-[120px] pointer-events-none" />
						<div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
							<span className="text-xs tracking-[0.2em] rtl:tracking-normal text-[--text-faint] uppercase font-bold mb-8 block">
								{t("teaser.eyebrow")}
							</span>
							<h2 className="text-5xl md:text-6xl font-light text-[--text-base] mb-10 leading-[1.1]">
								{t.rich("teaser.headline", {
									br: () => <br />
								})}
							</h2>
							<p className="text-[--text-muted] text-xl mb-14 leading-relaxed font-light max-w-xl mx-auto">
								{t("teaser.description")}
							</p>
							<Link
								href="/register"
								className="group text-terra-600 dark:text-terra-400 font-semibold border-b-2 border-terra-400/20 pb-1 hover:border-terra-500 transition-all inline-flex items-center gap-3 text-lg"
							>
								{t("teaser.cta")} <span className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{rtl ? '←' : '→'}</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-40 bg-[--bg-base]">
				<div className="max-w-7xl mx-auto px-6 lg:px-8">
					<h2 className="text-4xl font-light tracking-tight text-[--text-base] mb-24 text-center">
						{t("stories.title")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
						{testimonials.map((test) => (
							<div
								key={test.name}
								className="bg-white dark:bg-sanctum rounded-[2.5rem] p-12 shadow-[0_20px_60px_rgba(28,20,16,0.03)] relative transition-all hover:-translate-y-2"
							>
								<span className="absolute top-10 end-10 text-6xl text-sand-100 dark:text-white/5 font-serif leading-none select-none italic">
									"
								</span>
								<p className="text-[--text-muted] leading-relaxed mb-10 mt-4 relative z-10 text-lg font-light italic">
									{`"${test.quote}"`}
								</p>
								<div className="flex items-center gap-5">
									<div className="w-12 h-12 rounded-full bg-sand-100 dark:bg-white/10 flex items-center justify-center text-sm font-semibold text-terra-600 dark:text-terra-400">
										{test.initials}
									</div>
									<div>
										<p className="text-base font-semibold text-[--text-base]">{test.name}</p>
										<p className="text-xs text-[--text-faint] tracking-widest uppercase mt-1">
											{test.years}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
}
