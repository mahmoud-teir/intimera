"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { encrypt } from "@/lib/utils/crypto";

export async function addSharedNote(content: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		// Verify user is in a couple
		const coupleMember = await db.coupleMember.findFirst({
			where: { userId: session.user.id },
			include: { couple: true }
		});

		if (!coupleMember || !coupleMember.couple) {
			return { success: false, error: "You must be linked with a partner to leave shared notes." };
		}

		await db.sharedNote.create({
			data: {
				coupleId: coupleMember.coupleId,
				encryptedContent: encrypt(content),
			}
		});

		revalidatePath("/couple");
		return { success: true };
	} catch (error: any) {
		console.error("Error adding shared note:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

export async function deleteSharedNote(noteId: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		// Check if user is in the couple that owns this note
		const coupleMember = await db.coupleMember.findFirst({
			where: { userId: session.user.id }
		});

		if (!coupleMember) {
			return { success: false, error: "Unauthorized" };
		}

		const note = await db.sharedNote.findUnique({
			where: { id: noteId }
		});

		if (!note) {
			return { success: false, error: "Note not found" };
		}

		if (note.coupleId !== coupleMember.coupleId) {
			return { success: false, error: "You cannot delete this note" };
		}

		await db.sharedNote.delete({
			where: { id: noteId }
		});

		revalidatePath("/couple");
		return { success: true };
	} catch (error: any) {
		console.error("Error deleting shared note:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}
