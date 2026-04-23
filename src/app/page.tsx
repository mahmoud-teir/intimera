import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Footer } from "@/components/marketing/footer";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("marketing.hero");
	const tCommon = await getTranslations("common");
	const brand = tCommon("brandName");
	
	return {
		title: `${brand} | ${t("headline", { highlight: (chunks: string) => chunks })}`,
		description: t("subtext", { brand }),
		openGraph: {
			title: `${brand} | ${t("headline", { highlight: (chunks: string) => chunks })}`,
			description: t("subtext", { brand }),
			type: "website",
		},
	};
}

export default function LandingPage() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-grow">
				<Hero />
				<Features />
				<Pricing />
			</main>
			<Footer />
		</div>
	);
}
