export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-dvh bg-obsidian-dim">
			{/* Admin sidebar will be added in TASK-045 */}
			<main className="flex-1 p-8">{children}</main>
		</div>
	);
}
