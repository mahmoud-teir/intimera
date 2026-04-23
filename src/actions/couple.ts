"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendInviteEmail } from "@/lib/email";

/**
 * Ensures the current user has an active couple context.
 * Useful for lazily initializing a couple when they generate their first link.
 */
async function getOrCreateInitiatorCouple(userId: string) {
	// Find existing couple where user is an initiator or member
	const existingMember = await db.coupleMember.findFirst({
		where: { userId },
		include: { couple: true }
	});

	if (existingMember) {
		return existingMember.couple;
	}

	// Not in a couple, create a new one
	let inviteCode;
	let unique = false;
	
	// Ensure invite code is unique, though extremely unlikely to collide
	while (!unique) {
		inviteCode = Array.from(Array(10), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();
		const check = await db.couple.findUnique({ where: { inviteCode } });
		if (!check) unique = true;
	}

	// 7 days expiration
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + 7);

	const newCouple = await db.couple.create({
		data: {
			inviteCode: inviteCode as string,
			inviteExpiresAt: expiresAt,
			members: {
				create: {
					userId,
					role: "INITIATOR"
				}
			}
		}
	});

	return newCouple;
}

export async function generateInviteLink(emailAddress?: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		// Ensure the user doesn't already have an active partner
		const membership = await db.coupleMember.findFirst({
			where: { userId: session.user.id },
			include: {
				couple: {
					include: { members: true }
				}
			}
		});

		if (membership && membership.couple.members.length >= 2) {
			return { success: false, error: "You are already linked with a partner." };
		}

		const couple = await getOrCreateInitiatorCouple(session.user.id);
		
		const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
		const inviteUrl = `${appUrl}/couple/invite?code=${couple.inviteCode}`;

		// If an email address was provided, send them the email
		if (emailAddress) {
			const emailResult = await sendInviteEmail(emailAddress, inviteUrl, session.user.name);
			if (!emailResult.success) {
				// We keep going, but might report a warning
				console.error("Failed to send email:", emailResult.error);
				return { success: false, error: "Failed to send email notification, but link was generated.", inviteUrl, inviteCode: couple.inviteCode };
			}
		}

		return { 
			success: true, 
			inviteUrl,
			inviteCode: couple.inviteCode
		};

	} catch (error: any) {
		console.error("generateInviteLink error:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}

export async function acceptCoupleInvite(inviteCode: string) {
	try {
		const session = await auth.api.getSession({
			headers: await headers()
		});

		if (!session?.user) {
			return { success: false, error: "Unauthorized" };
		}

		const couple = await db.couple.findUnique({
			where: { inviteCode },
			include: { members: true }
		});

		if (!couple) {
			return { success: false, error: "Invalid or expired invitation link." };
		}

		// Check if expired
		if (couple.inviteExpiresAt && couple.inviteExpiresAt < new Date()) {
			return { success: false, error: "This invitation link has expired." };
		}

		// Check if couple is already full
		if (couple.members.length >= 2) {
			return { success: false, error: "This couple link has already been used by someone else." };
		}

		// Check if user is already IN this couple (e.g. they clicked their own link)
		const isAlreadyMember = couple.members.some(m => m.userId === session.user.id);
		if (isAlreadyMember) {
			return { success: true, message: "You are already in this couple." };
		}

		// Check if user is already in ANY couple
		const existingMembership = await db.coupleMember.findFirst({
			where: { userId: session.user.id }
		});

		if (existingMembership) {
			return { success: false, error: "You are already linked with a partner. You cannot join another." };
		}

		// Success logic - Add the new user as a MEMBER
		await db.coupleMember.create({
			data: {
				userId: session.user.id,
				coupleId: couple.id,
				role: "MEMBER"
			}
		});

		// Refresh the invite code to prevent reuse
		let newCode;
		let unique = false;
		while (!unique) {
			newCode = Array.from(Array(10), () => Math.floor(Math.random() * 36).toString(36)).join('').toUpperCase();
			const check = await db.couple.findUnique({ where: { inviteCode: newCode } });
			if (!check) unique = true;
		}

		await db.couple.update({
			where: { id: couple.id },
			data: { 
				inviteCode: newCode as string, // Reset so the old one can't be used again
				inviteExpiresAt: null // It's permanent once formed, or we can leave it
			}
		});

		return { success: true };

	} catch (error: any) {
		console.error("acceptCoupleInvite error:", error);
		return { success: false, error: "An unexpected error occurred" };
	}
}
