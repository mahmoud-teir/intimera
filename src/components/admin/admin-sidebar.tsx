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
	Zap,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

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

	const isContentManager = user.role === "CONTENT_MANAGER";
	const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || !isContentManager);

	return (
		<aside
			className="w-72 shrink-0 bg-background flex flex-col relative z-20 transition-all duration-500"
			aria-label="Admin navigation"
		>
			{/* Brand Area - Using surface shift instead of border */}
			<div className="h-24 flex items-center gap-4 px-8 bg-subtle/40 backdrop-blur-md">
				<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-terra-500 to-terra-600 flex items-center justify-center shadow-lg shadow-terra-500/20 group cursor-pointer hover:rotate-6 transition-all duration-500">
					<Zap className="w-5 h-5 text-white fill-white" aria-hidden="true" />
				</div>
				<div className="flex flex-col">
					<span className="font-bold text-foreground text-lg tracking-tight leading-none mb-1.5 uppercase italic">Intimera</span>
					<span className="text-[9px] font-bold bg-terra-500/10 text-terra-600 dark:text-terra-400 rounded-full px-3 py-1 uppercase tracking-[0.2em] w-fit">
						{isContentManager ? t("contentManager") : t("authority")}
					</span>
				</div>
			</div>

			{/* Navigation - Clean, editorial flow */}
			<nav className="flex-1 px-6 py-12 space-y-3" aria-label="Admin sections">
				<p className="px-5 text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em] mb-6">
					{t("coreManagement")}
				</p>
				
				{visibleItems.map(({ href, labelKey, icon: Icon }) => {
					const isActive = pathname.includes(href);
					return (
						<Link
							key={href}
							href={href}
							aria-current={isActive ? "page" : undefined}
							className={`group flex items-center gap-4 px-5 py-4 rounded-full text-sm font-medium transition-all duration-500 relative ${
								isActive
									? "text-terra-600 dark:text-terra-400 bg-terra-500/5 shadow-[0_4px_20px_rgba(216,95,60,0.08)]"
									: "text-foreground/60 hover:text-foreground hover:bg-subtle/60"
							}`}
						>
							<div className={`transition-all duration-500 ${isActive ? "text-terra-500" : "group-hover:text-terra-500"}`}>
								<Icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
							</div>
							<span className="tracking-wide">
								{t(labelKey as any)}
							</span>
							
							{isActive && (
								<div className="absolute right-6 w-1.5 h-1.5 bg-terra-500 rounded-full shadow-[0_0_8px_rgba(216,95,60,0.6)]" />
							)}
						</Link>
					);
				})}
			</nav>

			{/* Footer: User Profile + System Controls */}
			<div className="p-8 mt-auto space-y-6">
				<div className="flex items-center justify-center gap-6 px-4 py-2 bg-subtle/30 rounded-full border border-border/10">
					<ThemeToggle />
					<div className="w-px h-4 bg-border/20" />
					<LanguageSwitcher compact={false} />
				</div>

				<div className="bg-subtle/50 rounded-[40px] p-6 border border-border/10 group hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden relative">
					{/* Subtle glow effect in the corner */}
					<div className="absolute -bottom-8 -right-8 w-24 h-24 bg-terra-500/5 blur-3xl rounded-full" />
					
					<div className="flex items-center gap-4 mb-6">
						<div className="w-11 h-11 rounded-full bg-gradient-to-br from-sand-100 to-sand-200 dark:from-sand-800 dark:to-sand-900 flex items-center justify-center text-terra-600 dark:text-terra-400 text-sm font-bold shrink-0 shadow-inner group-hover:scale-105 transition-all duration-500">
							{user.name?.[0]?.toUpperCase() || "A"}
						</div>
						<div className="min-w-0">
							<p className="text-xs font-bold text-foreground truncate">{user.name || t("administrator")}</p>
							<p className="text-[10px] text-foreground/40 truncate font-medium">{user.email}</p>
						</div>
					</div>
					
					<button
						type="button"
						onClick={async () => {
							const { authClient } = await import("@/lib/auth-client");
							await authClient.signOut();
							window.location.href = "/login";
						}}
						className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-background text-foreground/60 hover:text-terra-500 hover:bg-terra-500/5 hover:border-terra-500/20 border border-border/50 shadow-sm transition-all duration-500 group-hover:bg-background/80"
					>
						<LogOut className="w-3.5 h-3.5" aria-hidden="true" />
						{t("terminateSession")}
					</button>
				</div>
			</div>
		</aside>
	);
}
