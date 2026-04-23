import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async ({ requestLocale }) => {
	// Our middleware rewrites /ar/... → /... so requestLocale always
	// resolves to the default "en". We must check the x-locale header
	// (set by middleware) first — it's the authoritative source.
	const headerStore = await headers();
	let locale = headerStore.get("x-locale");

	// Fallback: check cookie (e.g. direct navigation without locale prefix)
	if (!locale) {
		const cookieStore = await cookies();
		locale = cookieStore.get("NEXT_LOCALE")?.value ?? null;
	}

	// Last fallback: use what next-intl resolved (usually "en")
	if (!locale) {
		locale = (await requestLocale) ?? null;
	}

	// Ensure the locale is valid, fall back to default
	if (!locale || !routing.locales.includes(locale as any)) {
		locale = routing.defaultLocale;
	}

	return {
		locale,
		messages: (await import(`../../messages/${locale}.json`)).default,
	};
});
