"use client";

import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Logo } from "@/components/brand/logo";

export function Header() {
	const { data: session } = useSession();
	const { theme, setTheme } = useTheme();
	const [scrolled, setScrolled] = useState(false);
	const t = useTranslations("marketing.nav");

	useEffect(() => {
		const handler = () => setScrolled(window.scrollY > 10);
		window.addEventListener("scroll", handler, { passive: true });
		return () => window.removeEventListener("scroll", handler);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
				scrolled
					? "bg-[--bg-base]/80 backdrop-blur-2xl"
					: "bg-transparent"
			}`}
		>
			<div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
				{/* Logo */}
				<Link href="/" className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
					<Logo size="md" />
				</Link>

				{/* Nav */}
				<nav className="hidden md:flex items-center gap-8">
					<a
						href="#features"
						className="text-sm text-[--text-muted] hover:text-[--text-base] transition-colors"
					>
						{t("features")}
					</a>
					<a
						href="#pricing"
						className="text-sm text-[--text-muted] hover:text-[--text-base] transition-colors"
					>
						{t("pricing")}
					</a>
					<a
						href="#about"
						className="text-sm text-[--text-muted] hover:text-[--text-base] transition-colors"
					>
						{t("about")}
					</a>
				</nav>

				{/* Actions */}
				<div className="flex items-center gap-4">
					<LanguageSwitcher compact />
					
					<button
						aria-label="Toggle theme"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						className="p-2.5 rounded-2xl text-[--text-faint] hover:text-[--text-base] hover:bg-sand-100 dark:hover:bg-white/5 transition-all"
					>
						{theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
					</button>

					{session ? (
						<Link
							href="/dashboard"
							className="bg-gradient-to-br from-terra-500 to-terra-600 hover:to-terra-700 text-white text-sm font-semibold px-7 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-terra-500/20 flex items-center gap-2"
						>
							{t("dashboard")}
						</Link>
					) : (
						<>
							<Link
								href="/login"
								className="hidden md:block text-sm text-[--text-muted] hover:text-[--text-base] transition-colors tracking-wide"
							>
								{t("signIn")}
							</Link>
							<Link
								href="/register"
								className="bg-gradient-to-br from-terra-500 to-terra-600 hover:to-terra-700 text-white text-sm font-semibold px-7 py-3 rounded-full transition-all hover:shadow-lg hover:shadow-terra-500/20"
							>
								{t("getStarted")}
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
