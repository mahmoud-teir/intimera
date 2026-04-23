export default function LibraryLoading() {
	return (
		<div className="p-6 lg:p-10 space-y-8 animate-pulse" aria-busy="true" aria-label="Loading library">
			{/* Search + filter bar */}
			<div className="flex gap-3">
				<div className="flex-1 h-11 bg-sand-200 dark:bg-sand-800 rounded-xl" />
				<div className="h-11 w-32 bg-sand-200 dark:bg-sand-800 rounded-xl" />
			</div>

			{/* Category pills */}
			<div className="flex gap-2 flex-wrap">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="h-8 w-20 bg-sand-200 dark:bg-sand-800 rounded-full" />
				))}
			</div>

			{/* Article cards grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="bg-sand-100 dark:bg-sand-900/50 rounded-2xl overflow-hidden">
						<div className="h-44 bg-sand-200 dark:bg-sand-800" />
						<div className="p-5 space-y-3">
							<div className="h-4 w-20 bg-sand-200 dark:bg-sand-800 rounded" />
							<div className="h-5 w-full bg-sand-200 dark:bg-sand-800 rounded" />
							<div className="h-4 w-3/4 bg-sand-200 dark:bg-sand-800 rounded" />
							<div className="h-3 w-16 bg-sand-200 dark:bg-sand-800 rounded" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
