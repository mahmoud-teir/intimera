"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateReadingProgress(contentId: string, percentage: number) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const userId = session.user.id;

		// We use an upsert to either create the progress record or update it if the new percentage is higher
		const existingProgress = await db.progress.findUnique({
			where: {
				userId_contentId: {
					userId,
					contentId,
				}
			}
		});

		if (existingProgress) {
			// Only update if the new percentage is higher (don't regress if they scroll back up)
			if (percentage > existingProgress.percentage) {
				await db.progress.update({
					where: { id: existingProgress.id },
					data: {
						percentage: percentage,
						completedAt: percentage >= 100 && !existingProgress.completedAt ? new Date() : existingProgress.completedAt,
					}
				});
			}
		} else {
			await db.progress.create({
				data: {
					userId,
					contentId,
					percentage: percentage,
					completedAt: percentage >= 100 ? new Date() : null,
				}
			});
		}

		return { success: true };
	} catch (error: any) {
		console.error("Error updating reading progress:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}
