export default function DashboardLoading() {
	return (
		<div className="p-6 lg:p-10 space-y-8 animate-pulse" aria-busy="true" aria-label="Loading dashboard">
			{/* Header */}
			<div className="space-y-2">
				<div className="h-8 w-48 bg-sand-200 dark:bg-sand-800 rounded-xl" />
				<div className="h-4 w-64 bg-sand-100 dark:bg-sand-900 rounded-lg" />
			</div>

			{/* Stats grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="bg-sand-100 dark:bg-sand-900/50 rounded-2xl p-5 space-y-3">
						<div className="h-4 w-24 bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="h-8 w-16 bg-sand-200 dark:bg-sand-800 rounded-lg" />
					</div>
				))}
			</div>

			{/* Check-in card */}
			<div className="bg-sand-100 dark:bg-sand-900/50 rounded-3xl p-6 space-y-4">
				<div className="h-5 w-32 bg-sand-200 dark:bg-sand-800 rounded" />
				<div className="grid grid-cols-2 gap-4">
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className="h-12 bg-sand-200 dark:bg-sand-800 rounded-xl" />
					))}
				</div>
				<div className="h-24 bg-sand-200 dark:bg-sand-800 rounded-xl" />
				<div className="h-10 w-32 bg-sand-200 dark:bg-sand-800 rounded-xl" />
			</div>
		</div>
	);
}
