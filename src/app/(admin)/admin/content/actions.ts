"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Role, ContentStatus } from "@/generated/prisma/client";

async function getSessionRole(): Promise<Role> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) throw new Error("Unauthenticated");
	return (session.user as any).role as Role;
}

export async function createContent(data: any) {
	try {
		const role = await getSessionRole();
		// Content Managers can only submit PENDING content
		const status: ContentStatus =
			role === Role.CONTENT_MANAGER ? ContentStatus.PENDING : data.status;

		const content = await db.content.create({
			data: {
				slug: data.slug,
				categoryId: data.categoryId,
				tier: data.tier,
				status,
				difficulty: data.difficulty,
				relationshipStage: data.relationshipStage || "ANY",
				readingTimeMin: data.readingTimeMin,
				coverImage: data.coverImage || null,
				translations: {
					create: [
						{
							locale: "en",
							title: data.translations.en.title,
							summary: data.translations.en.summary,
							body: data.translations.en.body,
						},
						{
							locale: "ar",
							title: data.translations.ar.title,
							summary: data.translations.ar.summary,
							body: data.translations.ar.body,
						},
					],
				},
			},
		});

		revalidatePath("/admin/content");
		return { success: true, id: content.id, status };
	} catch (error) {
		console.error("Failed to create content:", error);
		return { success: false, error: "Database error" };
	}
}

export async function updateContent(id: string, data: any) {
	try {
		const role = await getSessionRole();
		// If a Content Manager edits, revert to PENDING for admin approval
		const status: ContentStatus =
			role === Role.CONTENT_MANAGER ? ContentStatus.PENDING : data.status;

		await db.content.update({
			where: { id },
			data: {
				slug: data.slug,
				categoryId: data.categoryId,
				tier: data.tier,
				status,
				difficulty: data.difficulty,
				relationshipStage: data.relationshipStage || "ANY",
				readingTimeMin: data.readingTimeMin,
				coverImage: data.coverImage || null,
				translations: {
					upsert: [
						{
							where: { contentId_locale: { contentId: id, locale: "en" } },
							update: {
								title: data.translations.en.title,
								summary: data.translations.en.summary,
								body: data.translations.en.body,
							},
							create: {
								locale: "en",
								title: data.translations.en.title,
								summary: data.translations.en.summary,
								body: data.translations.en.body,
							},
						},
						{
							where: { contentId_locale: { contentId: id, locale: "ar" } },
							update: {
								title: data.translations.ar.title,
								summary: data.translations.ar.summary,
								body: data.translations.ar.body,
							},
							create: {
								locale: "ar",
								title: data.translations.ar.title,
								summary: data.translations.ar.summary,
								body: data.translations.ar.body,
							},
						},
					],
				},
			},
		});

		revalidatePath("/admin/content");
		return { success: true };
	} catch (error) {
		console.error("Failed to update content:", error);
		return { success: false, error: "Database error" };
	}
}

export async function approveContent(id: string) {
	try {
		const role = await getSessionRole();
		if (role !== Role.ADMIN) {
			return { success: false, error: "Unauthorized: Only admins can approve content." };
		}

		await db.content.update({
			where: { id },
			data: {
				status: ContentStatus.PUBLISHED,
				publishedAt: new Date(),
			},
		});

		revalidatePath("/admin/content");
		return { success: true };
	} catch (error) {
		console.error("Failed to approve content:", error);
		return { success: false, error: "Database error" };
	}
}

export async function deleteContent(id: string) {
	try {
		const role = await getSessionRole();
		if (role !== Role.ADMIN) {
			return { success: false, error: "Unauthorized: Only admins can delete content." };
		}

		await db.content.delete({
			where: { id },
		});

		revalidatePath("/admin/content");
		return { success: true };
	} catch (error) {
		console.error("Failed to delete content:", error);
		return { success: false, error: "Database error" };
	}
}
