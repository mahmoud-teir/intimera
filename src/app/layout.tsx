import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Amiri } from "next/font/google";
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from "next-intl";
import { isRTL, type Locale } from "@/i18n/routing";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/lib/analytics/posthog";
import { PostHogPageView } from "@/lib/analytics/events";
import { ConsentBanner } from "@/components/analytics/consent-banner";
import { cookies, headers } from "next/headers";

const playfair = Playfair_Display({ 
	subsets: ["latin"], 
	weight: ["400", "500", "600", "700", "800", "900"],
	variable: "--font-sans" 
});
const amiri = Amiri({ 
	subsets: ["arabic"], 
	weight: ["400", "700"],
	variable: "--font-arabic" 
});

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("common");
	const brand = t("brandName");
	
	return {
		title: {
			default: `${brand} — Your Private Wellness Sanctuary`,
			template: `%s | ${brand}`,
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
		authors: [{ name: brand }],
		openGraph: {
			type: "website",
			locale: "en_US",
			siteName: brand,
			title: `${brand} — Your Private Wellness Sanctuary`,
			description:
				"Science-backed intimate wellness for couples. Learn, practice, and grow together.",
		},
		twitter: {
			card: "summary_large_image",
			title: `${brand} — Your Private Wellness Sanctuary`,
			description:
				"Science-backed intimate wellness for couples. Learn, practice, and grow together.",
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Read locale from header (set by middleware during rewrite) or cookie
	const headerStore = await headers();
	const cookieStore = await cookies();
	
	const locale = (headerStore.get("x-locale") || cookieStore.get("NEXT_LOCALE")?.value || "en") as Locale;
	const validLocales: Locale[] = ["en", "ar", "es", "fr"];
	const safeLocale: Locale = validLocales.includes(locale) ? locale : "en";

	// Load translation messages for this locale
	const messages = (await import(`../../messages/${safeLocale}.json`)).default;
	const dir = isRTL(safeLocale) ? "rtl" : "ltr";

	return (
		<html
			lang={safeLocale}
			dir={dir}
			data-scroll-behavior="smooth"
			suppressHydrationWarning
			className={cn("font-sans", playfair.variable, amiri.variable)}
		>
			<body className="min-h-dvh antialiased overflow-x-hidden" suppressHydrationWarning>
				<NextIntlClientProvider messages={messages} locale={safeLocale}>
					<PostHogProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							enableSystem
							disableTransitionOnChange={false}
						>
							{/* Skip navigation for keyboard users */}
							<a href="#main-content" className="skip-nav">
								Skip to main content
							</a>
							<PostHogPageView />
							<TooltipProvider>
								<main id="main-content">
									{children}
								</main>
							</TooltipProvider>
							<ConsentBanner />
						</ThemeProvider>
					</PostHogProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
