import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProfileForm } from "./profile-form";
import { getTranslations } from "next-intl/server";

export default async function ProfileSettingsPage() {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) return null;

	const t = await getTranslations("settings");

	return (
		<div>
			<h2 className="text-xl font-medium text-sand-900 dark:text-sand-100 mb-6">
				{t("profileSettings")}
			</h2>
			
			<div className="max-w-md">
				<ProfileForm user={{ id: session.user.id, name: session.user.name || "", email: session.user.email }} />
			</div>
		</div>
	);
}
