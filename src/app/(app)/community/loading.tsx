export default function CommunityLoading() {
	return (
		<div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6 animate-pulse" aria-busy="true" aria-label="Loading community">
			{/* Topic tabs */}
			<div className="flex gap-2 border-b border-sand-200 dark:border-sand-800 pb-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-8 w-24 bg-sand-200 dark:bg-sand-800 rounded-full" />
				))}
			</div>

			{/* Post list */}
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className="bg-sand-100 dark:bg-sand-900/50 rounded-2xl p-5 flex gap-4">
					{/* Vote column */}
					<div className="flex flex-col items-center gap-2 pt-1">
						<div className="w-6 h-6 bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="w-6 h-4 bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="w-6 h-6 bg-sand-200 dark:bg-sand-800 rounded" />
					</div>
					{/* Content */}
					<div className="flex-1 space-y-3">
						<div className="flex gap-2">
							<div className="h-5 w-16 bg-sand-200 dark:bg-sand-800 rounded-full" />
							<div className="h-5 w-24 bg-sand-200 dark:bg-sand-800 rounded-full" />
						</div>
						<div className="h-5 w-3/4 bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="h-4 w-full bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="h-4 w-1/2 bg-sand-200 dark:bg-sand-800 rounded" />
					</div>
				</div>
			))}
		</div>
	);
}
