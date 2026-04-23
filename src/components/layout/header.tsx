"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { User as UserIcon, Settings, LogOut, ChevronDown } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useTranslations } from "next-intl";

interface HeaderProps {
	user?: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	} | null;
	setSidebarOpen: (isOpen: boolean) => void;
}

export function Header({ user, setSidebarOpen }: HeaderProps) {
	const router = useRouter();
	const tNav = useTranslations("nav");
	const tSettings = useTranslations("settings");

	// Fallback initials for avatar
	const initials = user?.name
		? user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
		: "U";

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});
	};

	return (
		<header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-sand-200 dark:border-sand-800 bg-sand-50/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-30">
			{/* Mobile Toggle & Optional Breadcrumbs */}
			<div className="flex items-center">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setSidebarOpen(true)}
					className="lg:hidden me-4 text-sand-500 hover:text-sand-900 dark:hover:text-sand-100"
				>
					<Menu className="w-6 h-6" />
				</Button>
				{/* Space for future breadcrumbs or page title */}
			</div>

			{/* Actions & Profile */}
			<div className="flex items-center gap-4">
				<ThemeToggle />
				
				<div className="ps-4 border-s border-sand-200 dark:border-sand-800">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button type="button" className="flex items-center gap-3 group outline-none cursor-pointer border-none bg-transparent p-0">
								<div className="hidden md:flex flex-col items-end rtl:items-start rtl:text-right">
									<span className="text-sm font-medium text-sand-900 dark:text-sand-100 group-hover:text-terra-600 transition-colors">
										{user?.name || tNav("userFallback")}
									</span>
									<span className="text-xs text-sand-500 dark:text-sand-400">
										{user?.email || ""}
									</span>
								</div>
								
								<div className="relative">
									<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-terra-400 to-terra-600 flex items-center justify-center text-white font-medium shadow-sm border border-white/20 dark:border-white/10 shrink-0 overflow-hidden">
										{user?.image ? (
											<Image 
												src={user.image} 
												alt={user.name || "Avatar"} 
												width={40}
												height={40}
												className="w-full h-full object-cover"
											/>
										) : (
											<span>{initials}</span>
										)}
									</div>
									<div className="absolute -bottom-1 -inline-end-1 bg-white dark:bg-black rounded-full p-0.5 border border-sand-200 dark:border-sand-800">
										<ChevronDown className="w-3 h-3 text-sand-400" />
									</div>
								</div>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56 mt-2 bg-white dark:bg-black border-sand-200 dark:border-sand-800 rtl:text-right">
							{/* User info — plain div, not a GroupLabel (avoids Base UI Group context requirement) */}
							<div className="px-2 py-1.5 font-normal">
								<div className="flex flex-col gap-1">
									<p className="text-sm font-medium leading-none">{user?.name || tNav("userFallback")}</p>
									<p className="text-xs leading-none text-sand-500">{user?.email || ""}</p>
								</div>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem asChild>
									<Link href="/settings/profile" className="cursor-pointer flex items-center gap-2">
										<UserIcon className="h-4 w-4" />
										<span>{tSettings("profile")}</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/settings" className="cursor-pointer flex items-center gap-2">
										<Settings className="h-4 w-4" />
										<span>{tSettings("title")}</span>
									</Link>
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem 
									onClick={handleSignOut}
									className="text-terra-600 focus:text-terra-600 focus:bg-terra-50 dark:focus:bg-terra-950/30 cursor-pointer flex items-center gap-2"
								>
									<LogOut className="h-4 w-4" />
									<span>{tNav("signOut")}</span>
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
