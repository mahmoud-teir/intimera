"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";

export function Footer() {
	const t = useTranslations("marketing.footer");
	const tNav = useTranslations("marketing.nav");
	const tCommon = useTranslations("common");

	return (
		<footer className="bg-sand-100/50 dark:bg-obsidian-dim py-32 relative overflow-hidden">
			{/* Ambient top line glow */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-sand-200 dark:via-white/10 to-transparent" />
			
			<div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12">
					{/* Brand */}
					<div className="md:col-span-2">
						<Link href="/" className="mb-8 block transition-transform hover:scale-[1.02] active:scale-[0.98] origin-left rtl:origin-right">
							<Logo size="lg" />
						</Link>
						<p className="text-lg text-[--text-muted] leading-relaxed font-light max-w-sm">
							{t("tagline")}
						</p>
					</div>

					{/* Platform */}
					<div>
						<p className="text-xs font-bold tracking-[0.2em] text-[--text-base] uppercase mb-8">
							{t("platform")}
						</p>
						<ul className="space-y-4">
							{[
								{ label: tNav("features"), href: "#features" },
								{ label: tNav("pricing"), href: "#pricing" },
								{ label: tNav("about"), href: "/about" },
							].map((item) => (
								<li key={item.label}>
									<Link href={item.href} className="text-base text-[--text-muted] hover:text-terra-500 transition-colors font-light tracking-wide">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<p className="text-xs font-bold tracking-[0.2em] text-[--text-base] uppercase mb-8">
							{t("legal")}
						</p>
						<ul className="space-y-4">
							{[
								{ label: t("privacy"), href: "/privacy" },
								{ label: t("terms"), href: "/terms" },
								{ label: t("contact"), href: "/contact" },
							].map((item) => (
								<li key={item.label}>
									<Link href={item.href} className="text-base text-[--text-muted] hover:text-terra-500 transition-colors font-light tracking-wide">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-24 pt-12 border-t border-sand-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
					<p className="text-sm text-[--text-faint] font-light tracking-wide">
						{t("rights", { 
							year: new Date().getFullYear(),
							brand: tCommon("brandName")
						})}
					</p>
					<p className="text-sm text-[--text-faint] font-light tracking-wide flex items-center gap-2">
						<span className="w-1 h-1 rounded-full bg-terra-400" />
						{t("love")}
					</p>
				</div>
			</div>
		</footer>
	);
}
