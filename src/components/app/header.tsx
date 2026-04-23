"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/theme-toggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
	LayoutDashboard,
	BookOpen,
	Sparkles,
	MessageCircle,
	Users,
	Settings,
	LogOut,
	Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	const router = useRouter();
	const t = useTranslations("common");

	const handleSignOut = async () => {
		await authClient.signOut();
		router.push("/login");
	};

	return (
		<header className="h-16 border-b border-sand-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-md fixed top-0 w-full md:w-[calc(100%-16rem)] z-30 flex items-center justify-between px-4 md:px-8">
			<div className="flex items-center md:hidden">
				<Button variant="ghost" size="icon" className="mr-2 text-sand-600 dark:text-sand-400">
					<Menu className="w-5 h-5" />
				</Button>
				<span className="text-lg font-medium text-sand-900 dark:text-sand-100 border border-sand-200 dark:border-white/10 rounded-full px-3 py-1 bg-white dark:bg-obsidian shadow-sm">
					{t("brandName")}
				</span>
			</div>
			
			<div className="hidden md:flex">
				{/* Breadcrumbs or Page Title could go here */}
			</div>

			<div className="flex items-center space-x-3">
				<ThemeToggle />
				<Button 
					onClick={handleSignOut}
					variant="ghost" 
					size="icon" 
					className="text-sand-600 hover:text-red-600 dark:text-sand-400 dark:hover:text-red-400 transition-colors"
				>
					<LogOut className="w-5 h-5" />
				</Button>
			</div>
		</header>
	);
}
