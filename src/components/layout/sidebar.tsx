"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
	LayoutDashboard, 
	BookOpen, 
	Activity, 
	Sparkles, 
	Users, 
	HeartHandshake, 
	Bookmark, 
	Settings,
	X
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";

interface SidebarProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
	const pathname = usePathname();
	const t = useTranslations("nav");
	const tCommon = useTranslations("common");

	const navItems = [
		{ name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
		{ name: t("learn"), href: "/learn", icon: BookOpen },
		{ name: t("exercises"), href: "/exercises", icon: Activity },
		{ name: t("advisor"), href: "/advisor", icon: Sparkles },
		{ name: t("community"), href: "/community", icon: Users },
		{ name: t("couple"), href: "/couple", icon: HeartHandshake },
		{ name: t("bookmarks"), href: "/bookmarks", icon: Bookmark },
		{ name: t("settings"), href: "/settings", icon: Settings },
	];

	return (
		<>
			{/* Mobile Overlay */}
			{isOpen && (
				<div 
					className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Sidebar Container */}
			<aside 
				className={`
					fixed top-0 bottom-0 start-0 z-50 w-64 bg-sand-50 dark:bg-black border-e border-sand-200 dark:border-sand-800 
					transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:rtl:translate-x-0
					flex flex-col
					${isOpen 
						? "translate-x-0 opacity-100" 
						: "-translate-x-full rtl:translate-x-full opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto"
					}
				`}
			>
				{/* Header */}
				<div className="h-16 flex items-center justify-between px-6 border-b border-sand-200 dark:border-sand-800 shrink-0">
					<Link href="/dashboard" className="text-xl font-light tracking-tight text-sand-900 dark:text-sand-100">
						{tCommon("brandName")}
					</Link>
					<Button 
						variant="ghost" 
						size="icon" 
						onClick={(e) => {
							e.stopPropagation();
							setIsOpen(false);
						}}
						className="lg:hidden text-sand-500 hover:text-sand-900 dark:hover:text-sand-100 relative z-[60]"
						aria-label="Close menu"
					>
						<X className="w-5 h-5" />
					</Button>
				</div>

				{/* Navigation Links */}
				<div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
					{navItems.map((item) => {
						const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
						const Icon = item.icon;

						return (
							<Link
								key={item.name}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className={`
									flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
									${isActive 
										? "bg-terra-500/10 text-terra-600 dark:text-terra-400 font-medium" 
										: "text-sand-600 dark:text-sand-400 hover:bg-sand-100 dark:hover:bg-sand-900/50 hover:text-sand-900 dark:hover:text-sand-100"
									}
								`}
							>
								<Icon 
									className={`w-5 h-5 transition-colors duration-200 ${
										isActive 
											? "text-terra-500" 
											: "text-sand-400 group-hover:text-sand-600 dark:group-hover:text-sand-300"
									}`} 
									strokeWidth={isActive ? 2 : 1.5}
								/>
								<span>{item.name}</span>
							</Link>
						);
					})}
				</div>

				{/* Optional: Footer section (e.g., Upgrade Prompt) */}
				<div className="p-4 shrink-0">
					<div className="bg-gradient-to-br from-terra-500/10 to-sage-500/10 border border-terra-500/20 rounded-xl p-4 text-center">
						<Sparkles className="w-5 h-5 text-terra-500 mx-auto mb-2" />
						<p className="text-sm text-sand-700 dark:text-sand-300 font-medium mb-3">
							{t("unlockPremium")}
						</p>
						<Link 
							href="/settings/subscription" 
							className="w-full flex items-center justify-center h-9 text-sm font-medium bg-terra-500 hover:bg-terra-600 text-white rounded-lg transition-colors"
						>
							{t("upgradeNow")}
						</Link>
					</div>
				</div>
			</aside>
		</>
	);
}
