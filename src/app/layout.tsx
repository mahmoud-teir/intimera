import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
	title: {
		default: "Intimera — Your Private Wellness Sanctuary",
		template: "%s | Intimera",
	},
	description:
		"A science-backed, AI-enhanced intimate wellness platform for couples. Learn, practice, and grow together in a safe, private space.",
	keywords: [
		"intimate wellness",
		"couples wellness",
		"relationship health",
		"sexual education",
		"couples therapy",
	],
	authors: [{ name: "Intimera" }],
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "Intimera",
		title: "Intimera — Your Private Wellness Sanctuary",
		description:
			"Science-backed intimate wellness for couples. Learn, practice, and grow together.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Intimera — Your Private Wellness Sanctuary",
		description:
			"Science-backed intimate wellness for couples. Learn, practice, and grow together.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn("dark", "font-sans", geist.variable)}>
			<body className="min-h-dvh bg-obsidian text-ivory antialiased">
				{children}
			</body>
		</html>
	);
}
