import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/generated/prisma/client";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Gate: only ADMIN and CONTENT_MANAGER roles allowed
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session?.user) {
		redirect("/login?returnTo=/admin");
	}

	const role = (session.user as any).role as Role;
	if (role !== Role.ADMIN && role !== Role.CONTENT_MANAGER) {
		redirect("/dashboard");
	}

	return (
		<div className="flex min-h-dvh bg-background text-foreground transition-colors duration-300">
			<AdminSidebar user={{ ...session.user, role }} />
			<main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background/95 to-accent/5">
				{children}
			</main>
		</div>
	);
}

