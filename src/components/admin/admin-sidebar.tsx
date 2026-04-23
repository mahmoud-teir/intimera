"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	FileText,
	Users,
	ShieldAlert,
	BarChart3,
	LogOut,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/brand/logo";

const NAV_ITEMS = [
	{ href: "/admin/analytics", labelKey: "analytics", icon: BarChart3, adminOnly: true },
	{ href: "/admin/content", labelKey: "content", icon: FileText, adminOnly: false },
	{ href: "/admin/users", labelKey: "users", icon: Users, adminOnly: true },
	{ href: "/admin/moderation", labelKey: "moderation", icon: ShieldAlert, adminOnly: true },
];

interface AdminSidebarProps {
	user: { name?: string | null; email?: string | null; role?: string | null };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
	const pathname = usePathname();
	const t = useTranslations("admin");
	const tCommon = useTranslations("common");

	const isContentManager = user.role === "CONTENT_MANAGER";
	const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || !isContentManager);

	return (
		<aside
			className="w-72 shrink-0 bg-background flex flex-col relative z-20 transition-all duration-500"
			aria-label="Admin navigation"
		>
			{/* Brand Area - Using official Logo */}
			<div className="h-24 flex items-center gap-4 px-8 bg-subtle/40 backdrop-blur-md">
				<Link href="/admin/analytics" className="group">
					<Logo size="sm" showText={false} variant="gradient" className="group-hover:rotate-6 transition-all duration-500" />
				</Link>
				<div className="flex flex-col">
					<span className="font-bold text-foreground text-lg tracking-tight leading-none mb-1.5 uppercase italic">{tCommon("brandName")}</span>
					<span className="text-[11px] font-bold bg-terra-500/20 text-terra-600 dark:text-terra-400 rounded-full px-4 py-1.5 uppercase tracking-[0.2em] w-fit">
						{isContentManager ? t("contentManager") : t("authority")}
					</span>
				</div>
			</div>

			{/* Navigation - Clean, editorial flow */}
			<nav className="flex-1 px-6 py-12 space-y-3" aria-label="Admin sections">
				<p className="px-5 text-xs font-bold text-foreground/60 uppercase tracking-[0.3em] mb-6">
					{t("coreManagement")}
				</p>
				
				{visibleItems.map(({ href, labelKey, icon: Icon }) => {
					const isActive = pathname.includes(href);
					return (
						<Link
							key={href}
							href={href}
							aria-current={isActive ? "page" : undefined}
							className={`group flex items-center gap-4 px-5 py-4 rounded-full text-base font-semibold transition-all duration-500 relative ${
								isActive
									? "text-terra-600 dark:text-terra-400 bg-terra-500/5 shadow-[0_4px_20px_rgba(216,95,60,0.08)]"
									: "text-foreground/80 hover:text-foreground hover:bg-subtle/60"
							}`}
						>
							<div className={`transition-all duration-500 ${isActive ? "text-terra-500" : "group-hover:text-terra-500"}`}>
								<Icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
							</div>
							<span className="tracking-wide">
								{t(labelKey as any)}
							</span>
							
							{isActive && (
								<div className="absolute right-6 rtl:right-auto rtl:left-6 w-1.5 h-1.5 bg-terra-500 rounded-full shadow-[0_0_8px_rgba(216,95,60,0.6)]" />
							)}
						</Link>
					);
				})}
			</nav>

			{/* Footer: User Profile + System Controls */}
			<div className="p-8 mt-auto space-y-6">
				<div className="flex items-center justify-center gap-4 px-4 py-1.5 bg-subtle/30 rounded-full border border-border/10 w-fit mx-auto">
					<ThemeToggle />
					<div className="w-px h-4 bg-border/20" />
					<LanguageSwitcher compact={true} />
				</div>

				<div className="bg-subtle/50 rounded-[40px] p-6 border border-border/10 group hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden relative">
					{/* Subtle glow effect in the corner */}
					<div className="absolute -bottom-8 -right-8 rtl:-right-auto rtl:-left-8 w-24 h-24 bg-terra-500/5 blur-3xl rounded-full" />
					
					<div className="flex items-center gap-4 mb-6">
						<div className="w-11 h-11 rounded-full bg-gradient-to-br from-sand-100 to-sand-200 dark:from-sand-800 dark:to-sand-900 flex items-center justify-center text-terra-600 dark:text-terra-400 text-sm font-bold shrink-0 shadow-inner group-hover:scale-105 transition-all duration-500">
							{user.name?.[0]?.toUpperCase() || "A"}
						</div>
						<div className="min-w-0">
							<p className="text-sm font-bold text-foreground truncate">{user.name || t("administrator")}</p>
							<p className="text-xs text-foreground/60 truncate font-semibold">{user.email}</p>
						</div>
					</div>
					
					<button
						type="button"
						onClick={async () => {
							const { authClient } = await import("@/lib/auth-client");
							await authClient.signOut();
							window.location.href = "/login";
						}}
						className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-background text-foreground/80 hover:text-terra-500 hover:bg-terra-500/5 hover:border-terra-500/20 border border-border/50 shadow-sm transition-all duration-500 group-hover:bg-background/80"
					>
						<LogOut className="w-4 h-4" aria-hidden="true" />
						{t("terminateSession")}
					</button>
				</div>
			</div>
		</aside>
	);
}
