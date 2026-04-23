"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const name = formData.get("name") as string;
		if (!name || name.trim().length < 2) {
			return { success: false, error: "Name must be at least 2 characters long." };
		}

		await db.user.update({
			where: { id: session.user.id },
			data: { name: name.trim() }
		});

		revalidatePath("/settings/profile");
		revalidatePath("/", "layout"); // Update the header
		return { success: true };
	} catch (error: any) {
		console.error("Error updating profile:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

export async function deleteAccount() {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		// Retry logic for transient Neon cold-start timeouts
		const MAX_RETRIES = 3;
		for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
			try {
				// Because of onDelete: Cascade on relations, deleting the user will delete their data
				await db.user.delete({
					where: { id: session.user.id }
				});
				break; // success
			} catch (retryErr: any) {
				if (attempt < MAX_RETRIES && (retryErr.code === "ETIMEDOUT" || retryErr.code === "EAI_AGAIN")) {
					console.warn(`Delete attempt ${attempt} timed out, retrying...`);
					await new Promise((r) => setTimeout(r, 1000));
				} else {
					throw retryErr;
				}
			}
		}

	} catch (error: any) {
		console.error("Error deleting account:", error);
		return { success: false, error: "An unexpected error occurred" };
	}

	// Sign out and redirect
	redirect("/login?account_deleted=true");
}

export async function exportUserData() {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const userId = session.user.id;
		const { decryptOrNull } = await import("@/lib/utils/crypto");

		const user = await db.user.findUnique({
			where: { id: userId },
			include: {
				bookmarks: {
					include: { content: { select: { slug: true } } },
				},
				progress: {
					include: { content: { select: { slug: true } } },
				},
				checkIns: {
					orderBy: { createdAt: "asc" },
					select: {
						moodScore: true,
						connectionScore: true,
						encryptedNotes: true,
						createdAt: true,
					},
				},
				aiConversations: {
					include: {
						messages: {
							select: {
								role: true,
								encryptedContent: true,
								createdAt: true,
							},
							orderBy: { createdAt: "asc" },
						},
					},
					orderBy: { createdAt: "desc" },
				},
				exerciseCompletions: {
					include: { exercise: { select: { slug: true } } },
					orderBy: { completedAt: "desc" },
				},
				communityPosts: {
					select: { title: true, status: true, createdAt: true },
					orderBy: { createdAt: "desc" },
				},
			},
		});

		if (!user) {
			return { success: false, error: "User not found" };
		}

		const exportData = {
			_meta: {
				exportedAt: new Date().toISOString(),
				schemaVersion: "1.0",
				notice: "This export contains all personal data held by Intimera. Sensitive fields (notes, messages) are included in decrypted form.",
			},
			profile: {
				name: user.name,
				email: user.email,
				emailVerified: user.emailVerified,
				createdAt: user.createdAt,
				role: user.role,
			},
			bookmarks: user.bookmarks.map((b) => b.content.slug),
			readingProgress: user.progress.map((p) => ({
				content: p.content.slug,
				percentage: p.percentage,
				completedAt: p.completedAt,
			})),
			checkIns: user.checkIns.map((c) => ({
				moodScore: c.moodScore,
				connectionScore: c.connectionScore,
				notes: decryptOrNull(c.encryptedNotes),
				date: c.createdAt,
			})),
			aiConversations: user.aiConversations.map((conv) => ({
				id: conv.id,
				createdAt: conv.createdAt,
				messages: conv.messages.map((m) => ({
					role: m.role,
					content: decryptOrNull(m.encryptedContent),
					sentAt: m.createdAt,
				})),
			})),
			exerciseCompletions: user.exerciseCompletions.map((ec) => ({
				exercise: ec.exercise.slug,
				completedAt: ec.completedAt,
				score: ec.score,
			})),
			communityActivity: user.communityPosts.map((p) => ({
				title: p.title,
				status: p.status,
				postedAt: p.createdAt,
			})),
		};

		return { success: true, data: exportData };
	} catch (error: any) {
		console.error("Error exporting data:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}
