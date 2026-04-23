import { getTopics, getPosts } from "@/actions/community";
import { TopicTabs } from "@/components/community/topic-tabs";
import { PostList } from "@/components/community/post-list";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("community");
	return {
		title: `${t("title")} | Intimera`,
		description: t("description"),
	};
}

interface PageProps {
	searchParams: Promise<{ sort?: string }>;
}

export default async function CommunityPage(props: PageProps) {
	const searchParams = await props.searchParams;
	const t = await getTranslations("community");
	const sortBy = (searchParams.sort === "popular" ? "popular" : "recent") as "recent" | "popular";

	// Fetch data
	const topicsPromise = getTopics();
	const postsPromise = getPosts({ sortBy, limit: 20 });

	const [topicsResult, postsResult] = await Promise.all([topicsPromise, postsPromise]);

	const topics = topicsResult.success && topicsResult.topics ? topicsResult.topics : [];
	const posts = postsResult.success && postsResult.posts ? postsResult.posts : [];

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t("title")}</h1>
				<p className="text-slate-600 dark:text-slate-400">
					{t("description")}
				</p>
			</div>

			<TopicTabs topics={topics} />
			
			<div className="mt-8">
				<PostList posts={posts} sortBy={sortBy} />
			</div>
		</div>
	);
}
