export default function AdvisorLoading() {
	return (
		<div className="h-[calc(100dvh-4rem)] flex flex-col animate-pulse" aria-busy="true" aria-label="Loading advisor">
			{/* Header */}
			<div className="px-6 py-4 border-b border-sand-200 dark:border-sand-800 flex items-center gap-3">
				<div className="w-10 h-10 rounded-xl bg-sand-200 dark:bg-sand-800" />
				<div className="space-y-1">
					<div className="h-4 w-40 bg-sand-200 dark:bg-sand-800 rounded" />
					<div className="h-3 w-24 bg-sand-200 dark:bg-sand-800 rounded" />
				</div>
			</div>

			{/* Message thread */}
			<div className="flex-1 p-6 space-y-4 overflow-hidden">
				{/* Assistant message */}
				<div className="flex gap-3 max-w-lg">
					<div className="w-8 h-8 rounded-full bg-sand-200 dark:bg-sand-800 shrink-0" />
					<div className="space-y-2">
						<div className="h-4 w-64 bg-sand-200 dark:bg-sand-800 rounded-2xl" />
						<div className="h-4 w-48 bg-sand-200 dark:bg-sand-800 rounded-2xl" />
					</div>
				</div>
				{/* User message */}
				<div className="flex gap-3 max-w-xs ml-auto flex-row-reverse">
					<div className="w-8 h-8 rounded-full bg-terra-200 dark:bg-terra-800 shrink-0" />
					<div className="h-10 w-48 bg-terra-100 dark:bg-terra-900/50 rounded-2xl" />
				</div>
			</div>

			{/* Input area */}
			<div className="p-4 border-t border-sand-200 dark:border-sand-800">
				<div className="flex gap-2">
					<div className="flex-1 h-12 bg-sand-200 dark:bg-sand-800 rounded-xl" />
					<div className="w-12 h-12 bg-terra-200 dark:bg-terra-800 rounded-xl" />
				</div>
			</div>
		</div>
	);
}
