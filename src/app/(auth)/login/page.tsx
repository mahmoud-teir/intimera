import { LoginCard } from "@/components/auth/login-card";
import { Metadata } from "next";
import { Suspense } from "react";

import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("auth.login");
	return {
		title: t("title"),
		description: t("subtitle"),
	};
}

export default function LoginPage() {
	return (
		<div className="w-full max-w-md mx-auto p-4 z-10 relative">
			<Suspense fallback={<div className="w-full max-w-md h-[500px] rounded-3xl bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 animate-pulse" />}>
				<LoginCard />
			</Suspense>
		</div>
	);
}
