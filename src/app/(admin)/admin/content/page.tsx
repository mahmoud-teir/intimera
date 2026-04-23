import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { AdminContentTable } from "@/components/admin/content-table";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";
export const metadata = { title: "The Archive Vault" };

export default async function AdminContentPage() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session?.user) redirect("/login?returnTo=/admin/content");

	const role = session.user.role as Role;
	const content = await db.content.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			translations: { where: { locale: "en" }, select: { title: true } },
			category: { select: { name: true } },
			_count: { select: { bookmarks: true } },
		},
	});

	// Transform for the client component
	const contentRows = content.map((c) => ({
		id: c.id,
		title: c.translations[0]?.title || c.slug,
		slug: c.slug,
		status: c.status as any,
		category: c.category.name,
		tier: (c.tier as any) || "FREE",
		bookmarks: c._count.bookmarks,
		coverImage: c.coverImage || null,
		createdAt: c.createdAt.toISOString(),
	}));

	// Server Actions (Inline for migration)
	async function publishContent(id: string) {
		"use server";
		await db.content.update({ where: { id }, data: { status: "PUBLISHED" } });
		revalidatePath("/admin/content");
	}

	async function unpublishContent(id: string) {
		"use server";
		await db.content.update({ where: { id }, data: { status: "ARCHIVED" } });
		revalidatePath("/admin/content");
	}

	async function approveContent(id: string) {
		"use server";
		await db.content.update({ where: { id }, data: { status: "PUBLISHED" } });
		revalidatePath("/admin/content");
	}

	async function deleteContent(id: string) {
		"use server";
		await db.content.delete({ where: { id } });
		revalidatePath("/admin/content");
	}

	return (
		<div className="max-w-[1600px] mx-auto px-12 py-16 space-y-16">
			{/* Editorial Header */}
			<header className="space-y-6 max-w-3xl">
				<div className="flex items-center gap-4 text-amber-500 font-bold uppercase tracking-[0.4em] text-[11px]">
					<div className="w-12 h-px bg-amber-500/30" />
					Archive Management
				</div>
				<h1 className="text-6xl font-light tracking-tighter text-foreground leading-[1.1]">
					The Archive <span className="text-terra-500 italic">Vault</span>
				</h1>
				<p className="text-lg text-foreground/40 font-medium leading-relaxed">
					Curate and govern the educational assets of the sanctuary. 
					Review pending insights, manage the library, and ensure the vault remains a beacon of wisdom.
				</p>
			</header>

			{/* Main Content Area */}
			<section className="pb-20">
				<AdminContentTable 
					content={contentRows} 
					viewerRole={role}
					onPublish={publishContent}
					onUnpublish={unpublishContent}
					onApprove={approveContent}
					onDelete={deleteContent}
				/>
			</section>
		</div>
	);
}
