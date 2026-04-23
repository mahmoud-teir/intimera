import { google } from "@ai-sdk/google";
import { generateText, embed, embedMany } from "ai";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

// Configure the model strings
export const MODELS = {
	EMBEDDING: "text-embedding-004",
	ADVISOR: "gemini-1.5-flash", // Cost-effective model for the advisor
};

/**
 * Generates an embedding for a given text using OpenAI.
 */
export async function generateEmbedding(text: string) {
	try {
		const { embedding } = await embed({
			model: google.embedding(MODELS.EMBEDDING),
			value: text,
		});
		return embedding;
	} catch (error) {
		console.error("Error generating embedding:", error);
		throw error;
	}
}

/**
 * Retrieves the most relevant content chunks from the database
 * based on the semantic similarity to the query.
 */
export async function findSimilarContent(query: string, limit: number = 3) {
	try {
		const queryEmbedding = await generateEmbedding(query);
		
		// Convert the float[] embedding to the pgvector string format: '[0.1, 0.2, ...]'
		const embeddingVector = `[${queryEmbedding.join(',')}]`;

		// Perform raw SQL query to find closest vectors using inner product (<#>) or L2 distance (<->)
		// Assuming the ContentTranslation model contains our embeddings
		// <-> is L2 distance, ASC means closest.
		const similarContent = await db.$queryRaw`
			SELECT 
				ct."id",
				ct."contentId",
				ct."title",
				ct."summary",
				ct."body",
				c."slug",
				c."difficulty",
				ct.embedding <-> ${embeddingVector}::vector AS distance
			FROM "content_translation" ct
			JOIN "content" c ON ct."contentId" = c."id"
			WHERE ct.embedding IS NOT NULL
			ORDER BY distance ASC
			LIMIT ${limit}
		`;

		return similarContent as any[];
	} catch (error) {
		console.error("Error retrieving similar content:", error);
		return [];
	}
}

/**
 * Utility to inject retrieved RAG context into the Advisor's system prompt.
 */
export function buildAdvisorPrompt(contextItems: any[], brand: string = process.env.NEXT_PUBLIC_APP_NAME || "Intimera") {
	let contextString = `Below is information retrieved from the ${brand} relationship library:\n\n`;
	
	if (contextItems.length === 0) {
		contextString += "No relevant library articles found for this specific query.\n";
	} else {
		contextItems.forEach((item, i) => {
			contextString += `--- ARTICLE ${i + 1}: ${item.title} ---\n`;
			contextString += `Summary: ${item.summary}\n`;
			// We only include a snippet of the body to save tokens, or we can include the full body if it's small
			const snippet = item.body.substring(0, 500) + (item.body.length > 500 ? "..." : "");
			contextString += `Content Snippet: ${snippet}\n\n`;
		});
	}

	return `
You are the ${brand} AI Relationship Advisor. You are a compassionate, evidence-based relationship counselor. 
Your goal is to help users understand their feelings, communicate better with their partners, and build healthier relationships.

When responding to the user, you should:
1. Be empathetic, non-judgmental, and constructive.
2. Ground your advice in the provided ${brand} Library Content when relevant.
3. Recommend specific articles from the library by name (e.g., "I highly recommend reading 'Understanding Love Languages'").
4. Keep your responses concise and easy to read.
5. If the user is in crisis or facing abuse, gently advise them to seek professional local help.

### CONTEXT FROM LIBRARY ###
${contextString}
### END CONTEXT ###
	`.trim();
}

import { generateObject } from "ai";
import { z } from "zod";

/**
 * Moderates user-generated content for safety and appropriateness.
 */
export async function moderateContent(text: string) {
	try {
		const result = await generateObject({
			model: google(MODELS.ADVISOR),
			schema: z.object({
				status: z.enum(["APPROVED", "PENDING", "REJECTED"]).describe("APPROVED if safe, PENDING if needs human review, REJECTED if clearly inappropriate or violating policies."),
				reason: z.string().describe("Explanation for the chosen status. If APPROVED, can be empty. Keep short."),
			}),
			system: `You are an automated content moderator for a relationship and intimacy wellness community forum.
Evaluate the following user submission. 
- Mark as APPROVED if it is benign, supportive, seeking advice, or discussing relationship/intimacy issues maturely.
- Mark as PENDING if it borders on inappropriate, contains ambiguous language, or might require a human moderator's nuance.
- Mark as REJECTED if it contains explicit hate speech, non-consensual sexual content, illegal acts, severe harassment, or spam.
Be aware that clinical or mature discussions of intimacy are allowed and should be APPROVED unless they cross into explicit pornography or abuse.`,
			prompt: `Evaluate this content:\n\n${text}`
		});

		return result.object;
	} catch (error) {
		console.error("AI Moderation failed:", error);
		// Default to PENDING if AI fails so humans can review
		return { status: "PENDING" as const, reason: "AI Moderation failed or timed out." };
	}
}

