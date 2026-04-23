import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SubscriptionControls } from "./subscription-controls";
import { getTranslations } from "next-intl/server";

export default async function SubscriptionSettingsPage() {
	const t = await getTranslations("settings");
	const tCommon = await getTranslations("common");
	const brand = tCommon("brandName");
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) return null;

	const userRole = (session.user as any).role;

	return (
		<div>
			<h2 className="text-xl font-medium text-sand-900 dark:text-sand-100 mb-6">
				{t("subscriptionSettingsTitle")}
			</h2>
			
			<div className="max-w-xl">
				<p className="text-sand-600 dark:text-sand-400 mb-8 leading-relaxed">
					{t("subscriptionHelp", { brand })}
				</p>
				<SubscriptionControls currentRole={userRole} />
			</div>
		</div>
	);
}
