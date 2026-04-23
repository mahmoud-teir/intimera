import { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AppLayout({ children }: { children: ReactNode }) {
	const session = await auth.api.getSession({
		headers: await headers()
	});

	return (
		<AppShell user={session?.user}>
			{children}
		</AppShell>
	);
}
