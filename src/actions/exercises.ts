"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function completeExercise(exerciseId: string, responses: Record<string, any>, score?: number) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		// Encrypt/stringify responses for DB
		const stringifiedResponses = JSON.stringify(responses);

		// Record completion
		await db.exerciseCompletion.create({
			data: {
				userId: session.user.id,
				exerciseId,
				responses: stringifiedResponses,
				score: score ?? null,
			}
		});

		revalidatePath("/exercises");
		revalidatePath(`/exercises/${exerciseId}`);
		revalidatePath("/couple"); // To update shared stats
		
		return { success: true };
	} catch (error: any) {
		console.error("Error completing exercise:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}
