import { getActiveConversation } from "@/actions/advisor";
import { ChatInterface } from "@/components/advisor/chat-interface";
import type { UIMessage } from "ai";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations("advisor");
	return {
		title: `${t("title")} | Intimera`,
		description: t("description"),
	};
}

export default async function AdvisorPage() {
	const t = await getTranslations("advisor");
	const result = await getActiveConversation();

	if (!result.success || !result.conversation) {
		// If unauthorized or failed
		redirect("/login");
	}

	// Map DB messages to Vercel AI SDK UIMessage format
	const initialMessages: UIMessage[] = result.conversation.messages.map((msg) => ({
		id: msg.id,
		role: msg.role.toLowerCase() as "user" | "assistant",
		createdAt: msg.createdAt,
		parts: [{ type: "text" as const, text: msg.encryptedContent ?? "" }],
	}));

	return (
		<div className="container max-w-5xl mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{t("title")}</h1>
				<p className="text-slate-600 dark:text-slate-400">
					{t("description")}
				</p>
			</div>

			<ChatInterface 
				initialMessages={initialMessages} 
				conversationId={result.conversation.id} 
			/>
		</div>
	);
}
