import { getTopics, getPosts } from "@/actions/community";
import { TopicTabs } from "@/components/community/topic-tabs";
import { PostList } from "@/components/community/post-list";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
	const resolvedParams = await params;
	const t = await getTranslations("community");
	return {
		title: t("metaTitle", { topic: resolvedParams.topic }),
		description: t("metaDescription", { topic: resolvedParams.topic }),
	};
}

interface PageProps {
	params: Promise<{ topic: string }>;
	searchParams: Promise<{ sort?: string }>;
}

export default async function TopicPage(props: PageProps) {
	const params = await props.params;
	const searchParams = await props.searchParams;
	const t = await getTranslations("community");
	
	const topicSlug = params.topic;
	const sortBy = (searchParams.sort === "popular" ? "popular" : "recent") as "recent" | "popular";

	// Fetch data
	const topicsPromise = getTopics();
	const postsPromise = getPosts({ topicSlug, sortBy, limit: 20 });

	const [topicsResult, postsResult] = await Promise.all([topicsPromise, postsPromise]);

	const topics = topicsResult.success && topicsResult.topics ? topicsResult.topics : [];
	const posts = postsResult.success && postsResult.posts ? postsResult.posts : [];

	// Validate topic exists
	const currentTopic = topics.find(t => t.slug === topicSlug);
	if (!currentTopic && topics.length > 0) {
		notFound();
	}

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
				{currentTopic && (
					<div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
						<h2 className="text-lg font-semibold text-slate-900 dark:text-white">{currentTopic.name}</h2>
						{currentTopic.description && (
							<p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{currentTopic.description}</p>
						)}
					</div>
				)}

				<PostList posts={posts} sortBy={sortBy} />
			</div>
		</div>
	);
}
