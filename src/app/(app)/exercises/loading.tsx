export default function ExercisesLoading() {
	return (
		<div className="p-6 lg:p-10 space-y-8 animate-pulse" aria-busy="true" aria-label="Loading exercises">
			<div className="h-8 w-40 bg-sand-200 dark:bg-sand-800 rounded-xl" />
			{/* Filter row */}
			<div className="flex gap-3 flex-wrap">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-9 w-24 bg-sand-200 dark:bg-sand-800 rounded-full" />
				))}
			</div>
			{/* Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="bg-sand-100 dark:bg-sand-900/50 rounded-2xl p-5 space-y-3">
						<div className="flex justify-between">
							<div className="h-6 w-20 bg-sand-200 dark:bg-sand-800 rounded-full" />
							<div className="h-6 w-16 bg-sand-200 dark:bg-sand-800 rounded-full" />
						</div>
						<div className="h-5 w-full bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="h-4 w-3/4 bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="h-4 w-1/2 bg-sand-200 dark:bg-sand-800 rounded" />
						<div className="h-10 bg-sand-200 dark:bg-sand-800 rounded-xl mt-2" />
					</div>
				))}
			</div>
		</div>
	);
}
