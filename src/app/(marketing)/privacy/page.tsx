import { useTranslations } from "next-intl";

export default function PrivacyPage() {
	const t = useTranslations("marketing.privacyPage");
	const tCommon = useTranslations("common");
	const brand = tCommon("brandName");

	return (
		<main className="min-h-screen bg-[--bg-base] pt-32 pb-20">
			<div className="max-w-3xl mx-auto px-6 lg:px-8">
				<div className="mb-16">
					<h1 className="text-4xl md:text-6xl font-light text-[--text-base] tracking-tight mb-4">
						{t("title")}
					</h1>
					<p className="text-sm text-[--text-faint] font-light">
						{t("lastUpdated")}
					</p>
				</div>

				<div className="prose prose-sand dark:prose-invert max-w-none">
					<p className="text-xl text-[--text-muted] leading-relaxed font-light mb-12">
						{t("intro", { brand })}
					</p>

					{[1, 2, 3].map((i) => (
						<section key={i} className="mb-12">
							<h2 className="text-2xl font-medium text-[--text-base] mb-4">
								{t(`s${i}Title` as any)}
							</h2>
							<p className="text-[--text-muted] leading-relaxed font-light">
								{t(`s${i}Text` as any)}
							</p>
						</section>
					))}
				</div>
			</div>
		</main>
	);
}
