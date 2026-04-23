import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { AdminUsersTable } from "@/components/admin/users-table";
import { revalidatePath } from "next/cache";

import { useTranslations } from "next-intl";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
	return { title: "Sanctuary Guardians" }; // Metadata doesn't easily support t() in Next.js 15 without more setup, keeping as is or using a static key
}

export default async function AdminUsersPage() {
	const t = await import("next-intl/server").then(m => m.getTranslations("admin"));
	const session = await auth.api.getSession({ headers: await headers() });
	if ((session?.user?.role as Role) !== Role.ADMIN) redirect("/admin/content");

	const users = await db.user.findMany({
		orderBy: { createdAt: "desc" },
		take: 200, // Still limited, but fits current scale
	});

	// Transform for the client component
	const userRows = users.map((u) => ({
		id: u.id,
		name: u.name,
		email: u.email,
		role: u.role as any,
		emailVerified: !!u.emailVerified,
		stripeCustomerId: u.stripeCustomerId,
		aiSessions: 0, // Placeholder
		checkIns: 0, // Placeholder
		createdAt: u.createdAt.toISOString(),
	}));

	// Server Actions (Inline for simplicity in this migration step)
	async function deleteUser(id: string) {
		"use server";
		await db.user.delete({ where: { id } });
		revalidatePath("/admin/users");
	}

	async function changeRole(id: string, role: Role) {
		"use server";
		await db.user.update({ where: { id }, data: { role } });
		revalidatePath("/admin/users");
	}

	return (
		<div className="max-w-[1600px] mx-auto px-12 py-16 space-y-24 relative overflow-hidden">
			{/* Decorative Backdrop Glow */}
			<div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-terra-500/5 rounded-full blur-[120px] pointer-events-none" />

			{/* Editorial Header */}
			<header className="space-y-8 max-w-3xl relative z-10">
				<div className="flex items-center gap-4 text-terra-500 font-bold uppercase tracking-[0.4em] text-[11px] animate-in slide-in-from-left duration-700">
					<div className="w-12 h-px bg-terra-500/30" />
					{t("common.authorityCore")}
				</div>
				<h1 className="text-7xl font-light tracking-tighter text-foreground leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-1000">
					{t("usersPage.title")} <span className="text-terra-500 italic">{t("usersPage.titleItalic")}</span>
				</h1>
				<p className="text-xl text-foreground/40 font-medium leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
					{t("usersPage.description")}
				</p>
			</header>

			{/* Main Content Area */}
			<section className="pb-32 relative z-10">
				<AdminUsersTable 
					users={userRows} 
					onDelete={deleteUser} 
					onChangeRole={changeRole} 
				/>
			</section>
		</div>
	);
}
