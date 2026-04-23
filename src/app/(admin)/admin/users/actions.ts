"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/client";

export async function updateUserRole(targetUserId: string, newRole: Role) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user || ((session.user as any).role as Role) !== Role.ADMIN) {
		throw new Error("Unauthorized: Only admins can change user roles.");
	}

	if (session.user.id === targetUserId) {
		throw new Error("Cannot change your own role.");
	}

	await db.user.update({
		where: { id: targetUserId },
		data: { role: newRole },
	});

	revalidatePath("/admin/users");
	return { success: true };
}

export async function deleteUser(id: string) {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user || ((session.user as any).role as Role) !== Role.ADMIN) {
		throw new Error("Unauthorized: Only admins can delete users.");
	}

	await db.user.delete({ where: { id } });
	revalidatePath("/admin/users");
}
