import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SettingsNav } from "@/components/settings/settings-nav";

import { getTranslations } from "next-intl/server";

export default async function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) {
		redirect("/login");
	}

	const t = await getTranslations("settings");

	return (
		<div className="max-w-5xl mx-auto py-10 px-4">
			<div className="mb-10">
				<h1 className="text-3xl font-light tracking-tight text-sand-900 dark:text-sand-100">
					{t("title")}
				</h1>
				<p className="text-sand-600 dark:text-sand-400 mt-1">
					{t("description")}
				</p>
			</div>

			<div className="flex flex-col md:flex-row gap-8 md:gap-12">
				<aside className="w-full md:w-64 shrink-0">
					<SettingsNav />
				</aside>

				<main className="flex-1">
					<div className="bg-white/50 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-3xl p-6 md:p-10 min-h-[500px]">
						{children}
					</div>
				</main>
			</div>
		</div>
	);
}
