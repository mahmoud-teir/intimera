import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CoupleInviteAcceptCard } from "@/components/couple/invite-accept-card";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("couple.invite");
	return {
		title: t("acceptTitle"),
		description: t("acceptDescription"),
	};
}

export default async function CoupleInvitePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) {
		redirect(`/login?callbackUrl=/couple/invite?code=${(await searchParams).code}`);
	}

	const code = (await searchParams).code as string;
	const t = await getTranslations("couple.invite");

	if (!code) {
		return (
			<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
				<h1 className="text-2xl text-red-500 font-medium mb-2">{t("invalidLink")}</h1>
				<p className="text-sand-600 dark:text-sand-400">{t("invalidLinkDescription")}</p>
			</div>
		);
	}

	return (
		<div className="w-full max-w-lg mx-auto py-12 px-4">
			<CoupleInviteAcceptCard inviteCode={code} />
		</div>
	);
}
