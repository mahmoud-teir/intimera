"use client";

import { useTransition, useState } from "react";
import { updateProfile } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProfileForm({ user }: { user: { id: string; name: string; email: string } }) {
	const t = useTranslations("settings");
	const tCommon = useTranslations("common");
	const [isPending, startTransition] = useTransition();
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSuccess(false);
		setError(null);
		
		const formData = new FormData(e.currentTarget);
		
		startTransition(async () => {
			const res = await updateProfile(formData);
			if (res.success) {
				setSuccess(true);
				setTimeout(() => setSuccess(false), 3000);
			} else {
				setError(res.error || t("profileFailed"));
			}
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			
			{error && (
				<div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center">
					<AlertCircle className="w-4 h-4 mr-2" /> {error}
				</div>
			)}
			
			{success && (
				<div className="p-3 text-sm text-sage-600 bg-sage-50 dark:bg-sage-900/20 rounded-xl flex items-center">
					<CheckCircle2 className="w-4 h-4 mr-2" /> {t("profileUpdated")}
				</div>
			)}

			<div className="space-y-1">
				<label htmlFor="email" className="text-sm font-medium text-sand-700 dark:text-sand-300">
					{t("email")}
				</label>
				<Input 
					id="email" 
					type="email" 
					defaultValue={user.email} 
					disabled 
					className="bg-sand-50 dark:bg-sand-900/20 text-sand-500 cursor-not-allowed"
				/>
				<p className="text-xs text-sand-500 mt-1">{t("emailHelp")}</p>
			</div>

			<div className="space-y-1">
				<label htmlFor="name" className="text-sm font-medium text-sand-700 dark:text-sand-300">
					{t("displayName")}
				</label>
				<Input 
					id="name" 
					name="name" 
					type="text" 
					defaultValue={user.name} 
					required 
					minLength={2}
				/>
			</div>

			<Button type="submit" disabled={isPending} className="w-full bg-terra-500 hover:bg-terra-600 text-white rounded-xl h-11">
				{isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
				{tCommon("save")}
			</Button>
		</form>
	);
}
