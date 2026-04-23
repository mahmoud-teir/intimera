"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { encryptOrNull, decryptOrNull } from "@/lib/utils/crypto";

export async function submitCheckIn(formData: FormData) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const moodScore = parseInt(formData.get("moodScore") as string);
		const connectionScore = parseInt(formData.get("connectionScore") as string);
		const notes = formData.get("notes") as string;

		if (isNaN(moodScore) || moodScore < 1 || moodScore > 5) {
			return { success: false, error: "Invalid mood score" };
		}
		if (isNaN(connectionScore) || connectionScore < 1 || connectionScore > 5) {
			return { success: false, error: "Invalid connection score" };
		}

		// Find if user is in a couple
		const coupleMember = await db.coupleMember.findFirst({
			where: { userId: session.user.id }
		});

		await db.checkIn.create({
			data: {
				userId: session.user.id,
				coupleId: coupleMember?.coupleId || null,
				moodScore,
				connectionScore,
				encryptedNotes: encryptOrNull(notes || null),
			}
		});

		revalidatePath("/");
		revalidatePath("/couple");

		// Track check-in completion (server-side, fire-and-forget)
		if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
			const { PostHog } = await import("posthog-node");
			const ph = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
				host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
				flushAt: 1,
				flushInterval: 0,
			});
			ph.capture({
				distinctId: session.user.id,
				event: "check_in_completed",
				properties: {
					mood_score: moodScore,
					connection_score: connectionScore,
					has_notes: !!(notes && notes.trim()),
					in_couple: !!coupleMember,
				},
			});
			await ph.shutdown();
		}

		return { success: true };
	} catch (error: any) {
		console.error("Error submitting check-in:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}
