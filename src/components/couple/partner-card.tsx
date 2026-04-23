import { Heart } from "lucide-react";
import { User } from "@/generated/prisma/client";
import Image from "next/image";

interface PartnerCardProps {
	user: Pick<User, "name" | "image">;
	partner: Pick<User, "name" | "image">;
}

export function PartnerCard({ user, partner }: PartnerCardProps) {
	const getInitials = (name?: string | null) => 
		name ? name.substring(0, 2).toUpperCase() : "U";

	return (
		<div className="bg-white/50 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
			{/* Ambient Glow */}
			<div className="absolute inset-0 bg-gradient-to-br from-terra-500/10 to-sage-500/10 opacity-50" />
			
			<div className="relative z-10 flex items-center justify-center space-x-4 md:space-x-8 w-full max-w-sm mx-auto">
				
				{/* User Avatar */}
				<div className="flex flex-col items-center">
					<div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-terra-400 to-terra-600 shadow-lg border-4 border-white dark:border-sand-900 flex items-center justify-center overflow-hidden z-10">
						{user.image ? (
							<Image
								src={user.image}
								alt={user.name || "User avatar"}
								width={96}
								height={96}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-2xl font-bold text-white">{getInitials(user.name)}</span>
						)}
					</div>
					<span className="mt-3 font-medium text-sand-900 dark:text-sand-100">{user.name || "You"}</span>
				</div>

				{/* Connection Pulse */}
				<div className="relative flex items-center justify-center px-4">
					<div className="absolute w-24 h-px bg-gradient-to-r from-terra-500/0 via-terra-500/50 to-terra-500/0 z-0" />
					<div className="w-10 h-10 rounded-full bg-white dark:bg-black border border-sand-200 dark:border-sand-800 flex items-center justify-center z-10 shadow-sm animate-pulse">
						<Heart className="w-4 h-4 text-terra-500 fill-terra-500/20" />
					</div>
				</div>

				{/* Partner Avatar */}
				<div className="flex flex-col items-center">
					<div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-sage-400 to-sage-600 shadow-lg border-4 border-white dark:border-sand-900 flex items-center justify-center overflow-hidden z-10">
						{partner.image ? (
							<Image
								src={partner.image}
								alt={partner.name || "Partner avatar"}
								width={96}
								height={96}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-2xl font-bold text-white">{getInitials(partner.name)}</span>
						)}
					</div>
					<span className="mt-3 font-medium text-sand-900 dark:text-sand-100">{partner.name || "Partner"}</span>
				</div>
				
			</div>
		</div>
	);
}
