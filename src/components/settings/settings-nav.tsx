"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { UserCircle, Shield, CreditCard, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export function SettingsNav() {
	const pathname = usePathname();
	const t = useTranslations("settings");

	const navItems = [
		{ name: t("profile"), href: "/settings/profile", icon: UserCircle },
		{ name: t("couple"), href: "/settings/couple", icon: Heart },
		{ name: t("privacy"), href: "/settings/privacy", icon: Shield },
		{ name: t("subscription"), href: "/settings/subscription", icon: CreditCard },
	];

	return (
		<nav className="space-y-1">
			{navItems.map((item) => {
				const isActive = pathname.startsWith(item.href);
				const Icon = item.icon;
				
				return (
					<Link
						key={item.name}
						href={item.href}
						className={`
							flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
							${isActive 
								? "bg-terra-50 text-terra-700 dark:bg-terra-900/20 dark:text-terra-400" 
								: "text-sand-600 hover:bg-sand-50 dark:text-sand-400 dark:hover:bg-white/5"
							}
						`}
					>
						<Icon 
							className={`w-5 h-5 mr-3 ${isActive ? "text-terra-500" : "text-sand-400"}`} 
						/>
						{item.name}
					</Link>
				);
			})}
		</nav>
	);
}
