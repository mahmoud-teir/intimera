import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PrivacyControls } from "./privacy-controls";
import { getTranslations } from "next-intl/server";

export default async function PrivacySettingsPage() {
	const t = await getTranslations("settings");
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) return null;

	return (
		<div>
			<h2 className="text-xl font-medium text-sand-900 dark:text-sand-100 mb-6">
				{t("privacySettingsTitle")}
			</h2>
			
			<div className="max-w-xl">
				<p className="text-sand-600 dark:text-sand-400 mb-8 leading-relaxed">
					{t("privacyHelp")}
				</p>
				<PrivacyControls />
			</div>
		</div>
	);
}
