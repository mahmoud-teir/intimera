"use client";

import { useTransition, useState } from "react";
import { acceptCoupleInvite } from "@/actions/couple";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, HeartHandshake } from "lucide-react";

export function CoupleInviteAcceptCard({ inviteCode }: { inviteCode: string }) {
	const [isPending, startTransition] = useTransition();
	const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);
	const router = useRouter();

	async function handleAccept() {
		startTransition(async () => {
			const res = await acceptCoupleInvite(inviteCode);
			if (res.success) {
				setMessage({ text: "Invitation accepted! You are now linked.", type: "success" });
				setTimeout(() => {
					router.push("/dashboard");
					router.refresh();
				}, 1500);
			} else {
				setMessage({ text: res.error || "Failed to accept invitation.", type: "error" });
			}
		});
	}

	return (
		<Card className="w-full max-w-md bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden group rounded-3xl mx-auto">
			<div className="absolute inset-0 bg-gradient-to-br from-terra-500/10 via-transparent to-sage-500/10 opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity duration-1000" />
			
			<CardHeader className="relative z-10 pt-10 px-8 text-center space-y-4">
				<div className="mx-auto w-16 h-16 bg-gradient-to-tr from-terra-400 to-terra-600 rounded-full flex items-center justify-center shadow-lg shadow-terra-500/20">
					<HeartHandshake className="text-white w-8 h-8" />
				</div>
				<CardTitle className="text-2xl font-light tracking-tight text-sand-900 dark:text-sand-100">
					Couple Invitation
				</CardTitle>
				<CardDescription className="text-sand-600 dark:text-sand-400">
					You have been invited to link your account. Accept to start your shared journey.
				</CardDescription>
			</CardHeader>
			<CardContent className="relative z-10 px-8 pb-8 space-y-6">
				{message && (
					<div className={`p-4 text-sm rounded-xl text-center border font-medium ${
						message.type === "error" 
							? "bg-red-500/10 text-red-500 border-red-500/20" 
							: "bg-sage-500/10 text-sage-600 dark:text-sage-400 border-sage-500/20"
					}`}>
						{message.text}
					</div>
				)}

				<Button 
					onClick={handleAccept} 
					disabled={isPending || message?.type === "success"}
					className="w-full h-12 bg-terra-500 hover:bg-terra-600 text-white rounded-xl shadow-[0_0_20px_rgba(169,104,86,0.3)] transition-all duration-300 text-base"
				>
					{isPending ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Accepting...</> : "Accept Invitation"}
				</Button>
				
				<Button
					variant="ghost"
					onClick={() => router.push("/dashboard")}
					className="w-full text-sand-500 hover:text-sand-700 dark:hover:text-sand-300"
				>
					Decline and return to Home
				</Button>
			</CardContent>
		</Card>
	);
}
