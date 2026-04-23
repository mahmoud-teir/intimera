import { getTopics } from "@/actions/community";
import { CreatePostForm } from "@/components/community/create-post-form";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("community");
	return {
		title: t("createMetaTitle"),
		description: t("createMetaDescription"),
	};
}

export default async function CreatePostPage() {
	// Require authentication
	const session = await auth.api.getSession({
		headers: await headers()
	});

	if (!session?.user) {
		redirect("/login");
	}

	const t = await getTranslations("community");

	// Fetch topics
	const topicsResult = await getTopics();
	const topics = topicsResult.success && topicsResult.topics ? topicsResult.topics : [];

	return (
		<div className="container max-w-3xl mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t("createTitle")}</h1>
				<p className="text-slate-600 dark:text-slate-400">
					{t("createDescription")}
				</p>
			</div>

			<div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
				<CreatePostForm topics={topics} />
			</div>
		</div>
	);
}
