import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CoupleSettingsCard } from "@/components/couple/couple-settings-card";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("nav");
	return {
		title: t("couple"),
		description: "Manage your couple status and invitations.",
	};
}

export default async function CoupleSettingsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	const t = await getTranslations("settings");

	// Fetch current user's couple membership
	const membership = await db.coupleMember.findFirst({
		where: { userId: session.user.id },
		include: {
			couple: {
				include: {
					members: {
						include: {
							user: {
								select: { id: true, name: true, image: true, email: true }
							}
						}
					}
				}
			}
		}
	});

	let isLinked = false;
	let partnerName = null;

	if (membership && membership.couple.members.length > 1) {
		isLinked = true;
		const partner = membership.couple.members.find(m => m.userId !== session.user.id);
		if (partner) {
			partnerName = partner.user.name;
		}
	}

	return (
		<div className="space-y-6 max-w-2xl">
			<div>
				<h1 className="text-3xl font-light tracking-tight text-sand-900 dark:text-sand-100">{t("coupleSettingsTitle")}</h1>
				<p className="text-sand-600 dark:text-sand-400 mt-2">{t("coupleSubtitle")}</p>
			</div>

			<CoupleSettingsCard isLinked={isLinked} partnerName={partnerName} />
			
			<div className="pt-8">
				<p className="text-sm text-sand-500 max-w-lg">
					{t("couplePrivacy")}
				</p>
			</div>
		</div>
	);
}
