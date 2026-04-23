"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { useState, useTransition } from "react";
import { routing, type Locale } from "@/i18n/routing";

const LOCALE_LABELS: Record<Locale, string> = {
	en: "English",
	ar: "العربية",
	es: "Español",
	fr: "Français",
};

interface LanguageSwitcherProps {
	/** If true, renders as a compact icon button. Default: full dropdown. */
	compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
	const locale = useLocale() as Locale;
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);

	const handleLocaleChange = (nextLocale: Locale) => {
		setIsOpen(false);

		// Set locale cookie so server can read it on next request
		document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

		startTransition(() => {
			let newPath = pathname;

			// Strip existing locale prefix (ar/es/fr)
			const localePrefix = routing.locales
				.filter((l) => l !== routing.defaultLocale)
				.find((l) => pathname.startsWith(`/${l}`));

			if (localePrefix) {
				newPath = pathname.slice(`/${localePrefix}`.length) || "/";
			}

			// Add the new locale prefix if it's not the default locale
			if (nextLocale !== routing.defaultLocale) {
				newPath = `/${nextLocale}${newPath}`;
			}

			router.push(newPath);
			router.refresh();
		});
	};

	return (
		<div className="relative" id="language-switcher">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				disabled={isPending}
				aria-label={`Current language: ${LOCALE_LABELS[locale]}. Click to change language.`}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				className={`flex items-center gap-1.5 text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100 transition-colors rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terra-500 ${
					compact
						? "p-2"
						: "px-3 py-1.5 border border-sand-200 dark:border-sand-700 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 text-sm"
				} ${isPending ? "opacity-50 cursor-wait" : ""}`}
			>
				<Globe className="w-4 h-4" aria-hidden="true" />
				{!compact && (
					<span className="font-medium">{LOCALE_LABELS[locale]}</span>
				)}
			</button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className="fixed inset-0 z-40"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					{/* Dropdown */}
					<ul
						role="listbox"
						aria-label="Select language"
						className="absolute right-0 mt-2 w-40 bg-white dark:bg-black border border-sand-200 dark:border-sand-800 rounded-xl shadow-lg overflow-hidden z-50 py-1"
					>
						{routing.locales.map((loc) => (
							<li key={loc} role="option" aria-selected={locale === loc}>
								<button
									type="button"
									onClick={() => handleLocaleChange(loc)}
									className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
										locale === loc
											? "bg-terra-50 dark:bg-terra-900/20 text-terra-600 dark:text-terra-400 font-medium"
											: "text-sand-700 dark:text-sand-300 hover:bg-sand-50 dark:hover:bg-sand-900/20"
									}`}
								>
									<span>{LOCALE_LABELS[loc]}</span>
									{locale === loc && (
										<span className="ml-auto text-terra-500" aria-hidden="true">✓</span>
									)}
								</button>
							</li>
						))}
					</ul>
				</>
			)}
		</div>
	);
}
