import { ForgotPasswordCard } from "@/components/auth/forgot-password-card";
import { Metadata } from "next";

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("auth.forgotPassword");
	return {
		title: t("title"),
		description: t("description"),
	};
}

export default function ForgotPasswordPage() {
	return (
		<div className="w-full max-w-md mx-auto p-4 z-10 relative">
			<ForgotPasswordCard />
		</div>
	);
}
