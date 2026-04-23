import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
	// Supported locales
	locales: ["en", "ar", "es", "fr"],

	// Default locale — served without a prefix (e.g. /dashboard)
	defaultLocale: "en",

	// Prefix strategy: only add locale prefix for non-default locales
	// /dashboard → English, /ar/dashboard → Arabic, /es/dashboard → Spanish
	localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

// RTL languages
export const RTL_LOCALES: Locale[] = ["ar"];

export function isRTL(locale: Locale): boolean {
	return RTL_LOCALES.includes(locale);
}

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
