"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Pricing() {
	const t = useTranslations("marketing.pricing");

	const plans = [
		{
			name: t("plans.essential.name"),
			price: t("plans.essential.price"),
			description: t("plans.essential.description"),
			features: [
				t("plans.essential.f1"),
				t("plans.essential.f2"),
				t("plans.essential.f3"),
				t("plans.essential.f4"),
			],
			cta: t("plans.essential.cta"),
			href: "/register",
			highlighted: false,
		},
		{
			name: t("plans.premium.name"),
			price: t("plans.premium.price"),
			period: t("plans.premium.period"),
			description: t("plans.premium.description"),
			features: [
				t("plans.premium.f1"),
				t("plans.premium.f2"),
				t("plans.premium.f3"),
				t("plans.premium.f4"),
				t("plans.premium.f5"),
			],
			cta: t("plans.premium.cta"),
			href: "/register?plan=premium",
			highlighted: true,
		},
	];

	return (
		<section className="py-40 bg-[--bg-base] relative" id="pricing">
			<div className="container mx-auto px-6 md:px-8">
				<div className="text-center max-w-3xl mx-auto mb-24">
					<motion.h2 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-5xl md:text-6xl font-light tracking-tight text-[--text-base] mb-8"
					>
						{t.rich("headline", {
							highlight: (chunks) => (
								<span className="font-serif italic text-terra-500">{chunks}</span>
							),
						})}
					</motion.h2>
					<motion.p 
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8, delay: 0.1 }}
						className="text-xl text-[--text-muted] font-light max-w-2xl mx-auto"
					>
						{t("subheadline")}
					</motion.p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8, delay: index * 0.2 }}
							className="h-full"
						>
							<div className={`h-full flex flex-col rounded-[2.5rem] p-10 md:p-14 transition-all duration-700 hover:-translate-y-3 ${
								plan.highlighted 
									? "bg-[#1C1410] dark:bg-sanctum text-white shadow-[0_40px_100px_rgba(28,20,16,0.12)] relative scale-105 z-10" 
									: "bg-white dark:bg-white/5 shadow-[0_20px_60px_rgba(28,20,16,0.03)]"
							}`}>
								{plan.highlighted && (
									<div className="absolute top-10 end-10">
										<span className="bg-terra-500 text-white text-[10px] font-bold tracking-[0.2em] rtl:tracking-normal uppercase px-4 py-1.5 rounded-full">
											{t("plans.premium.popular" as any) || "POPULAR"}
										</span>
									</div>
								)}
								<div className="mb-10">
									<h3 className={`text-3xl font-light mb-4 ${plan.highlighted ? "text-white" : "text-[--text-base]"}`}>
										{plan.name}
									</h3>
									<p className={`text-lg font-light ${plan.highlighted ? "text-sand-300" : "text-[--text-muted]"}`}>
										{plan.description}
									</p>
									<div className="mt-8 flex items-baseline">
										<span className={`text-6xl font-light tracking-tighter ${plan.highlighted ? "text-white" : "text-[--text-base]"}`}>{plan.price}</span>
										{plan.period && (
											<span className={`ms-2 text-xl font-light ${plan.highlighted ? "text-sand-400" : "text-[--text-faint]"}`}>{plan.period}</span>
										)}
									</div>
								</div>
								
								<div className="flex-1 mb-12">
									<ul className="space-y-5">
										{plan.features.map((feature) => (
											<li key={feature} className="flex items-start">
												<div className={`mt-1.5 p-0.5 rounded-full me-4 shrink-0 ${plan.highlighted ? "bg-terra-500" : "bg-sage-100 dark:bg-sage-500/20"}`}>
													<Check className={`h-3.5 w-3.5 ${plan.highlighted ? "text-white" : "text-sage-600 dark:text-sage-400"}`} />
												</div>
												<span className={`text-lg font-light ${plan.highlighted ? "text-sand-200" : "text-[--text-muted]"}`}>
													{feature}
												</span>
											</li>
										))}
									</ul>
								</div>
								
								<Link 
									href={plan.href}
									className={`inline-flex items-center justify-center w-full rounded-full py-5 text-lg font-semibold tracking-wide transition-all duration-300 ${
										plan.highlighted 
											? "bg-gradient-to-br from-terra-500 to-terra-600 hover:to-terra-700 text-white shadow-xl shadow-terra-500/20" 
											: "bg-sand-100 dark:bg-white/5 hover:bg-sand-200 dark:hover:bg-white/10 text-sand-900 dark:text-white"
									}`}
								>
									{plan.cta}
								</Link>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
