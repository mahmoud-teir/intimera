import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { findSimilarContent, buildAdvisorPrompt, MODELS } from "@/lib/ai";
import { getTranslations } from "next-intl/server";
import { Limiters, rateLimitResponse } from "@/lib/utils/rate-limit";
import { encrypt } from "@/lib/utils/crypto";
import { Role } from "@/generated/prisma/client";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		// 1. Tier-aware rate limiting
		const isPremium = session.user.role === Role.PREMIUM || session.user.role === Role.COUPLES;
		const limiter = isPremium
			? Limiters.advisorPremium(session.user.id)
			: Limiters.advisorFree(session.user.id);

		const { success, reset, remaining } = await limiter;

		if (!success) {
			return rateLimitResponse(reset);
		}

		const body = await req.json();
		const { messages, conversationId } = body;

		if (!messages || messages.length === 0) {
			return new Response("No messages provided", { status: 400 });
		}

		// Extract the text from the latest message (v3 parts format)
		const latestParts = messages[messages.length - 1]?.parts ?? [];
		const latestMessage = latestParts
			.filter((p: any) => p.type === "text")
			.map((p: any) => p.text)
			.join("") || messages[messages.length - 1]?.content || "";

		// 2. RAG Retrieval — find similar articles based on the user's query
		const relevantContent = await findSimilarContent(latestMessage, 3);
		
		// 3. Build System Prompt with retrieved context
		const tCommon = await getTranslations("common");
		const brandName = tCommon("brandName");
		const systemPrompt = buildAdvisorPrompt(relevantContent, brandName);

		// Save the User's message to the DB (encrypted)
		if (conversationId) {
			await db.aiMessage.create({
				data: {
					conversationId,
					role: "USER",
					encryptedContent: encrypt(latestMessage),
				}
			});
		}

		// 4. Call OpenAI with streaming
		const result = await streamText({
			model: google(MODELS.ADVISOR),
			system: systemPrompt,
			messages,
			onFinish: async ({ text }) => {
				if (!conversationId) return;
				// Save the Assistant's response once the stream finishes (encrypted)
				await db.aiMessage.create({
					data: {
						conversationId,
						role: "ASSISTANT",
						encryptedContent: encrypt(text),
					}
				});
				
				// Update conversation timestamp
				await db.aiConversation.update({
					where: { id: conversationId },
					data: { updatedAt: new Date() }
				});
			}
		});

		const response = result.toTextStreamResponse();
		// Attach rate-limit headers to the response
		response.headers.set("X-RateLimit-Remaining", String(remaining));
		response.headers.set("X-RateLimit-Reset", String(reset));
		return response;
	} catch (error: any) {
		console.error("Error in chat route:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
