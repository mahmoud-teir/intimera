"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { decrypt } from "@/lib/utils/crypto";

/**
 * Gets the active AI conversation for the user, or creates one if none exists.
 * Returns the conversation and its messages.
 */
export async function getActiveConversation() {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		let conversation = await db.aiConversation.findFirst({
			where: { userId: session.user.id },
			include: {
				messages: {
					orderBy: { createdAt: "asc" }
				}
			},
			orderBy: { updatedAt: "desc" }
		});

		if (!conversation) {
			conversation = await db.aiConversation.create({
				data: {
					userId: session.user.id,
					title: "Wellness Advisory Session",
				},
				include: { messages: true }
			});
		}

		// Decrypt message content before returning to the client
		if (conversation) {
			conversation = {
				...conversation,
				messages: conversation.messages.map((msg) => ({
					...msg,
					encryptedContent: (() => {
						try { return decrypt(msg.encryptedContent); }
						catch { return msg.encryptedContent; } // Graceful fallback for legacy unencrypted messages
					})()
				}))
			};
		}

		return { success: true, conversation };
	} catch (error: any) {
		console.error("Error fetching conversation:", error);
		return { success: false, error: "Failed to fetch conversation" };
	}
}

/**
 * Deletes the specified conversation.
 */
export async function clearConversation(conversationId: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		// Ensure it belongs to user
		const conversation = await db.aiConversation.findUnique({
			where: { id: conversationId }
		});

		if (!conversation || conversation.userId !== session.user.id) {
			return { success: false, error: "Not found or unauthorized" };
		}

		await db.aiConversation.delete({
			where: { id: conversationId }
		});

		revalidatePath("/advisor");

		return { success: true };
	} catch (error: any) {
		console.error("Error clearing conversation:", error);
		return { success: false, error: "Failed to clear conversation" };
	}
}
