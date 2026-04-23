"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(contentId: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const userId = session.user.id;

		const existingBookmark = await db.bookmark.findUnique({
			where: {
				userId_contentId: {
					userId,
					contentId,
				}
			}
		});

		if (existingBookmark) {
			// Remove bookmark
			await db.bookmark.delete({
				where: { id: existingBookmark.id }
			});
		} else {
			// Add bookmark
			await db.bookmark.create({
				data: {
					userId,
					contentId,
				}
			});
		}

		revalidatePath("/learn");
		revalidatePath("/bookmarks");
		
		return { success: true, isBookmarked: !existingBookmark };
	} catch (error: any) {
		console.error("Error toggling bookmark:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}
