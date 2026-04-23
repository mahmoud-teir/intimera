import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

interface PremiumGateProps {
	userRole: string | undefined;
	allowedRoles?: string[]; // e.g. ["PREMIUM", "COUPLES", "ADMIN"]
	fallbackMessage?: string;
	children: React.ReactNode;
}

export function PremiumGate({ 
	userRole, 
	allowedRoles = ["PREMIUM", "COUPLES", "ADMIN"],
	fallbackMessage = "Unlock this feature with Intimera Premium.",
	children 
}: PremiumGateProps) {
	const isAllowed = userRole && allowedRoles.includes(userRole.toUpperCase());

	if (isAllowed) {
		return <>{children}</>;
	}

	return (
		<div className="relative overflow-hidden rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-900/20 p-8 text-center group">
			<div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
			<div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors" />
			
			<div className="relative z-10 flex flex-col items-center">
				<div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center mb-4 text-indigo-500">
					<Lock className="w-6 h-6" />
				</div>
				
				<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center">
					Premium Feature
					<Sparkles className="w-4 h-4 ml-2 text-amber-500" />
				</h3>
				
				<p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
					{fallbackMessage}
				</p>
				
				<Link 
					href="/pricing"
					className="inline-flex items-center justify-center px-6 py-2.5 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
				>
					View Upgrade Options
				</Link>
			</div>
		</div>
	);
}
