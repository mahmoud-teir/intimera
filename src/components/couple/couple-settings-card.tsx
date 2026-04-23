"use client";

import { useState, useTransition } from "react";
import { generateInviteLink } from "@/actions/couple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Send, Check } from "lucide-react";
import { useTranslations } from "next-intl";

export function CoupleSettingsCard({ isLinked, partnerName }: { isLinked: boolean, partnerName?: string | null }) {
	const t = useTranslations("couple");
	const [email, setEmail] = useState("");
	const [isPending, startTransition] = useTransition();
	const [inviteLink, setInviteLink] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

	async function handleGenerateLink() {
		setMessage(null);
		startTransition(async () => {
			const res = await generateInviteLink();
			if (res.success && res.inviteUrl) {
				setInviteLink(res.inviteUrl);
			} else {
				setMessage({ text: res.error || t("generateFailed"), type: "error" });
			}
		});
	}

	async function handleSendEmail(e: React.FormEvent) {
		e.preventDefault();
		if (!email) return;

		setMessage(null);
		startTransition(async () => {
			const res = await generateInviteLink(email);
			if (res.success && res.inviteUrl) {
				setInviteLink(res.inviteUrl);
				setMessage({ text: t("inviteSent"), type: "success" });
				setEmail("");
			} else {
				setMessage({ text: res.error || t("inviteFailed"), type: "error" });
			}
		});
	}

	function handleCopy() {
		if (inviteLink) {
			navigator.clipboard.writeText(inviteLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	}

	if (isLinked) {
		return (
			<Card className="bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 shadow-xl rounded-2xl overflow-hidden relative">
				<div className="absolute inset-0 bg-gradient-to-br from-terra-500/5 via-transparent to-sage-500/5 pointer-events-none" />
				<CardHeader className="relative z-10">
					<CardTitle className="text-xl text-sand-900 dark:text-sand-100">{t("status")}</CardTitle>
					<CardDescription className="text-sand-600 dark:text-sand-400">
						{t("linkedDescription")}
					</CardDescription>
				</CardHeader>
				<CardContent className="relative z-10">
					<div className="flex items-center space-x-4 bg-white/10 dark:bg-black/10 p-4 rounded-xl border border-white/10 dark:border-white/5">
						<div className="w-12 h-12 bg-gradient-to-tr from-terra-400 to-terra-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
							{partnerName?.[0]?.toUpperCase() || "P"}
						</div>
						<div>
							<p className="font-medium text-sand-900 dark:text-sand-100">{partnerName || t("partnerFallback")}</p>
							<p className="text-sm text-sage-600 dark:text-sage-400">{t("linkedSuccessfully")}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-white/5 dark:bg-black/20 border-white/10 dark:border-white/5 shadow-xl rounded-2xl overflow-hidden relative">
			<div className="absolute inset-0 bg-gradient-to-br from-terra-500/10 via-transparent to-sage-500/10 pointer-events-none" />
			<CardHeader className="relative z-10">
				<CardTitle className="text-xl font-light tracking-tight text-sand-900 dark:text-sand-100">
					{t("inviteTitle")}
				</CardTitle>
				<CardDescription className="text-sand-600 dark:text-sand-400">
					{t("inviteDescription")}
				</CardDescription>
			</CardHeader>
			<CardContent className="relative z-10 space-y-6">
				{message && (
					<div className={`p-3 text-sm rounded-xl text-center border ${
						message.type === "error" 
							? "bg-red-500/10 text-red-500 border-red-500/20" 
							: "bg-sage-500/10 text-sage-600 dark:text-sage-400 border-sage-500/20"
					}`}>
						{message.text}
					</div>
				)}

				<form onSubmit={handleSendEmail} className="space-y-4">
					<div className="space-y-2">
						<Label className="text-sand-700 dark:text-sand-300">{t("emailLabel")}</Label>
						<div className="flex space-x-2">
							<Input
								type="email"
								placeholder="partner@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 rounded-xl"
								disabled={isPending}
							/>
							<Button 
								type="submit" 
								disabled={!email || isPending}
								className="bg-terra-500 hover:bg-terra-600 text-white rounded-xl shadow-md transition-colors w-24"
							>
								{isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{t("sendButton")} <Send className="w-4 h-4 ml-2" /></>}
							</Button>
						</div>
					</div>
				</form>

				<div className="relative flex items-center py-2">
					<div className="flex-grow border-t border-sand-200 dark:border-sand-800"></div>
					<span className="flex-shrink-0 mx-4 text-sand-400 text-sm">{t("orManual")}</span>
					<div className="flex-grow border-t border-sand-200 dark:border-sand-800"></div>
				</div>

				<div className="space-y-2">
					{inviteLink ? (
						<div className="flex space-x-2">
							<Input
								readOnly
								value={inviteLink}
								className="bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 rounded-xl font-mono text-xs text-sand-500 dark:text-sand-400"
							/>
							<Button
								type="button"
								variant="outline"
								onClick={handleCopy}
								className="rounded-xl border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-white/5 min-w-[100px]"
							>
								{copied ? <><Check className="w-4 h-4 mr-2" /> {t("copied")}</> : <><Copy className="w-4 h-4 mr-2" /> {t("copyLink")}</>}
							</Button>
						</div>
					) : (
						<Button 
							type="button" 
							variant="outline"
							onClick={handleGenerateLink}
							disabled={isPending}
							className="w-full h-11 border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-white/5 rounded-xl text-sand-700 dark:text-sand-300 transition-all font-medium"
						>
							{isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : t("generateLink")}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
