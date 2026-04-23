import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Pricing } from "@/components/marketing/pricing";
import { Footer } from "@/components/marketing/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Intimera | Elevate Your Intimate Life Together",
	description:
		"Intimera is a science-backed, private sanctuary to explore, understand, and elevate your intimate life together.",
	openGraph: {
		title: "Intimera | Elevate Your Intimate Life Together",
		description: "A private sanctuary for couples to explore intimacy.",
		type: "website",
	},
};

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
