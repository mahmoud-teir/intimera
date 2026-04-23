import { Suspense } from "react";
import { Sparkles, Activity } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ExerciseFilterBar } from "@/components/exercises/exercise-filter-bar";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { SubscriptionTier, RelationshipStage, ExerciseType } from "@/generated/prisma/client";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function ExercisesPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const resolvedParams = await searchParams;
	const t = await getTranslations("exercises");
	
	const typeParam = typeof resolvedParams.type === "string" ? resolvedParams.type : "all";
	const type = Object.values(ExerciseType).includes(typeParam as ExerciseType)
		? (typeParam as ExerciseType)
		: null;

	const stageParam = typeof resolvedParams.stage === "string" ? resolvedParams.stage : "ANY";
	const stage = Object.values(RelationshipStage).includes(stageParam as RelationshipStage)
		? (stageParam as RelationshipStage)
		: RelationshipStage.ANY;

	const session = await auth.api.getSession({
		headers: await headers()
	});

	const userTier = (session?.user as any)?.role === "ADMIN" 
		? SubscriptionTier.PREMIUM 
		: SubscriptionTier.FREE;

	// Fetch Exercises
	const whereClause: any = {
		status: "PUBLISHED",
	};

	if (type) {
		whereClause.type = type;
	}

	if (stage !== RelationshipStage.ANY) {
		whereClause.relationshipStage = stage;
	}

	const exercises = await db.exercise.findMany({
		where: whereClause,
		orderBy: { createdAt: "desc" }
	});

	// Fetch Completed Exercises for User
	let completedIds = new Set<string>();
	if (session?.user) {
		const completions = await db.exerciseCompletion.findMany({
			where: { userId: session.user.id },
			select: { exerciseId: true }
		});
		completedIds = new Set(completions.map(c => c.exerciseId));
	}

	return (
		<div className="max-w-6xl mx-auto py-6">
			{/* Page Header */}
			<div className="mb-10">
				<div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
					<div className="w-12 h-12 bg-sage-100 dark:bg-sage-900/30 rounded-2xl flex items-center justify-center">
						<Activity className="w-6 h-6 text-sage-600" strokeWidth={1.5} />
					</div>
					<div>
						<h1 className="text-3xl font-light tracking-tight text-sand-900 dark:text-sand-100">
							{t("title")}
						</h1>
						<p className="text-sand-600 dark:text-sand-400 mt-1">
							{t("description")}
						</p>
					</div>
				</div>
			</div>

			{/* Filter Bar */}
			<Suspense fallback={<div className="h-16 bg-sand-100 dark:bg-sand-900/50 animate-pulse rounded-xl mb-8" />}>
				<ExerciseFilterBar />
			</Suspense>

			{/* Content Grid */}
			{exercises.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{exercises.map((exercise) => {
						const isLocked = exercise.tier === SubscriptionTier.PREMIUM && userTier === SubscriptionTier.FREE;
						const isCompleted = completedIds.has(exercise.id);

						return (
							<ExerciseCard 
								key={exercise.id} 
								exercise={exercise} 
								isLocked={isLocked}
								isCompleted={isCompleted}
							/>
						);
					})}
				</div>
			) : (
				<div className="py-20 text-center border border-dashed border-sand-200 dark:border-sand-800 rounded-3xl">
					<Sparkles className="w-12 h-12 text-sand-300 dark:text-sand-700 mx-auto mb-4" strokeWidth={1} />
					<h3 className="text-lg font-medium text-sand-900 dark:text-sand-100 mb-2">{t("noExercisesTitle")}</h3>
					<p className="text-sand-500 max-w-md mx-auto">
						{t("noExercisesDescription")}
					</p>
				</div>
			)}
		</div>
	);
}
