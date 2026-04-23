"use client";

import { useState } from "react";
import { CreditCard, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { createCustomerPortalSession } from "@/actions/stripe";
import { useTranslations } from "next-intl";

export function SubscriptionControls({ currentRole }: { currentRole: string | undefined }) {
	const t = useTranslations("subscription");
	const tCommon = useTranslations("common");
	const brand = tCommon("brandName");
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const isPremium = currentRole === "PREMIUM" || currentRole === "COUPLES" || currentRole === "ADMIN";
	const planName = currentRole === "COUPLES" ? t("couplesPlan", { brand }) : currentRole === "PREMIUM" ? t("premiumPlan", { brand }) : t("freePlan", { brand });

	const handleManageBilling = async () => {
		setIsLoading(true);
		if (isPremium) {
			const result = await createCustomerPortalSession();
			if (result.success && result.url) {
				window.location.href = result.url;
			} else {
				alert(result.error || t("billingFailed"));
				setIsLoading(false);
			}
		} else {
			router.push("/pricing");
		}
	};

	return (
		<div className="space-y-8">
			{/* Current Plan Card */}
			<div className={`
				border-2 rounded-3xl p-6 md:p-8 relative overflow-hidden
				${isPremium 
					? "border-terra-500 bg-terra-50 dark:bg-terra-900/10" 
					: "border-sand-200 dark:border-sand-800 bg-white/50 dark:bg-black/20"
				}
			`}>
				{isPremium && (
					<div className="absolute top-0 right-0 p-6 opacity-10">
						<Sparkles className="w-32 h-32 text-terra-500" />
					</div>
				)}

				<div className="relative z-10">
					<div className="flex items-center space-x-3 mb-2">
						{isPremium ? (
							<div className="w-10 h-10 bg-terra-100 dark:bg-terra-900/50 rounded-full flex items-center justify-center">
								<Sparkles className="w-5 h-5 text-terra-600 dark:text-terra-400" />
							</div>
						) : (
							<div className="w-10 h-10 bg-sand-100 dark:bg-sand-900/50 rounded-full flex items-center justify-center">
								<CreditCard className="w-5 h-5 text-sand-600 dark:text-sand-400" />
							</div>
						)}
						<h3 className="text-xl font-semibold text-sand-900 dark:text-sand-100">
							{planName}
						</h3>
					</div>

					<p className="text-sand-600 dark:text-sand-400 mb-6 max-w-sm">
						{isPremium 
							? t("premiumBenefit", { brand })
							: t("freeBenefit")
						}
					</p>

					{!isPremium && (
						<div className="space-y-3 mb-8">
							{[t("feature1"), t("feature2"), t("feature3"), t("feature4")].map(feat => (
								<div key={feat} className="flex items-center text-sm text-sand-700 dark:text-sand-300">
									<CheckCircle2 className="w-4 h-4 mr-2 text-terra-500" />
									{feat}
								</div>
							))}
						</div>
					)}

					<Button 
						className={`
							h-11 px-8 rounded-xl font-medium transition-transform active:scale-95 flex items-center
							${isPremium 
								? "bg-white dark:bg-black text-sand-900 dark:text-sand-100 border border-sand-200 dark:border-sand-800 hover:bg-sand-50 dark:hover:bg-sand-900" 
								: "bg-terra-500 hover:bg-terra-600 text-white shadow-md shadow-terra-500/20"
							}
						`}
						onClick={handleManageBilling}
						disabled={isLoading}
					>
						{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
						{isPremium ? t("manageButton") : t("upgradeButton")}
					</Button>
				</div>
			</div>
		</div>
	);
}
