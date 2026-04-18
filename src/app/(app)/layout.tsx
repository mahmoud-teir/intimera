export default function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-dvh bg-obsidian">
			{/* Sidebar will be added in TASK-016 */}
			<main className="flex-1">{children}</main>
		</div>
	);
}
