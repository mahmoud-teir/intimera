"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	BookOpen,
	Sparkles,
	MessageCircle,
	Users,
	Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Learn", href: "/learn", icon: BookOpen },
	{ name: "Exercises", href: "/exercises", icon: Sparkles },
	{ name: "AI Advisor", href: "/advisor", icon: MessageCircle },
	{ name: "Couple", href: "/couple", icon: Users },
	{ name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
	const pathname = usePathname();

	return (
		<aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-[--bg-surface]/95 backdrop-blur-xl border-r border-sand-100 dark:border-white/5 md:flex flex-col h-screen">
			{/* Logo */}
			<div className="h-16 flex items-center px-8 border-b border-sand-100 dark:border-white/5">
				<Link href="/dashboard" className="flex items-center">
					<span className="text-xl font-light tracking-widest text-[--text-base]">
						Intimera<span className="text-terra-500">.</span>
					</span>
				</Link>
			</div>

			{/* Nav */}
			<div className="flex-1 overflow-y-auto py-6 px-4">
				<nav className="space-y-0.5">
					{navigation.map((item) => {
						const isActive =
							pathname === item.href ||
							pathname.startsWith(`${item.href}/`);
						const Icon = item.icon;

						return (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									"flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 group",
									isActive
										? "bg-terra-50 dark:bg-terra-500/10 text-terra-600 dark:text-terra-400 font-medium"
										: "text-[--text-muted] hover:text-[--text-base] hover:bg-sand-50 dark:hover:bg-white/5"
								)}
							>
								<Icon
									className={cn(
										"w-5 h-5 transition-colors shrink-0",
										isActive ? "text-terra-500" : "text-[--text-faint] group-hover:text-[--text-muted]"
									)}
								/>
								<span className="text-sm">{item.name}</span>
								{isActive && (
									<div className="ml-auto w-1.5 h-1.5 rounded-full bg-terra-500" />
								)}
							</Link>
						);
					})}
				</nav>
			</div>

			{/* User Profile */}
			<div className="p-4 border-t border-sand-100 dark:border-white/5">
				<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-sand-50 dark:bg-black/20">
					<div className="w-9 h-9 rounded-full bg-gradient-to-br from-terra-400 to-sage-400 flex items-center justify-center text-white text-sm font-semibold shrink-0">
						U
					</div>
					<div className="flex flex-col min-w-0">
						<span className="text-sm font-medium text-[--text-base] truncate">My Account</span>
						<span className="text-xs text-[--text-faint]">Free Tier</span>
					</div>
				</div>
			</div>
		</aside>
	);
}
