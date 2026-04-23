import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";

export default function AboutPage() {
	const t = useTranslations("marketing.about");
	const tCommon = useTranslations("common");
	const brand = tCommon("brandName");

	return (
		<main className="min-h-screen bg-[--bg-base] pt-32 pb-20">
			<div className="max-w-4xl mx-auto px-6 lg:px-8">
				{/* Hero section */}
				<div className="text-center mb-24">
					<div className="flex justify-center mb-8">
						<Logo size="xl" showText={false} />
					</div>
					<h1 className="text-5xl md:text-7xl font-light text-[--text-base] tracking-tight mb-6">
						{t("title", { brand })}
					</h1>
					<p className="text-xl md:text-2xl text-[--text-muted] font-light">
						{t("subtitle")}
					</p>
				</div>

				{/* Mission */}
				<section className="mb-24">
					<h2 className="text-3xl font-light text-[--text-base] mb-8 pb-4 border-b border-sand-200 dark:border-white/5">
						{t("missionTitle")}
					</h2>
					<p className="text-xl text-[--text-muted] leading-relaxed font-light">
						{t("missionText", { brand })}
					</p>
				</section>

				{/* Values */}
				<section className="mb-24">
					<h2 className="text-3xl font-light text-[--text-base] mb-12">
						{t("valuesTitle")}
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						{[1, 2, 3].map((i) => (
							<div key={i} className="group">
								<h3 className="text-xl font-medium text-terra-500 mb-4">
									{t(`v${i}Title` as any)}
								</h3>
								<p className="text-[--text-muted] leading-relaxed font-light">
									{t(`v${i}Text` as any)}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Approach */}
				<section className="bg-sand-100/50 dark:bg-white/5 p-12 rounded-[2rem] border border-sand-200 dark:border-white/5">
					<h2 className="text-3xl font-light text-[--text-base] mb-8">
						{t("approachTitle")}
					</h2>
					<p className="text-xl text-[--text-muted] leading-relaxed font-light">
						{t("approachText")}
					</p>
				</section>
			</div>
		</main>
	);
}
