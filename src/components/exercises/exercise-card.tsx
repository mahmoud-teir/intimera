"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, Clock, Signal, CheckCircle2, PlayCircle } from "lucide-react";
import { Exercise, SubscriptionTier } from "@/generated/prisma/client";
import { useTranslations } from "next-intl";

interface ExerciseCardProps {
	exercise: Exercise;
	isLocked: boolean;
	isCompleted: boolean;
}

export function ExerciseCard({ exercise, isLocked, isCompleted }: ExerciseCardProps) {
	const t = useTranslations("exercises");
	const libraryT = useTranslations("library");

	const getIcon = () => {
		if (isCompleted) return <CheckCircle2 className="w-10 h-10 text-sage-500 bg-white/80 dark:bg-black/80 rounded-full" />;
		if (isLocked) return <Lock className="w-8 h-8 text-terra-500" />;
		return <PlayCircle className="w-12 h-12 text-sand-900/50 dark:text-sand-100/50 group-hover:text-terra-500 transition-colors bg-white/40 dark:bg-black/40 rounded-full" />;
	};

	const getTypeLabel = (type: string) => {
		switch (type) {
			case "COUPLE": return t("coupleActivity");
			case "INDIVIDUAL": return t("individual");
			case "QUIZ": return t("quiz");
			default: return t("exercise");
		}
	};

	return (
		<Link 
			href={isLocked ? "/settings/subscription" : `/exercises/${exercise.slug}`}
			className="group block relative h-full bg-white/5 dark:bg-black/20 border border-sand-200 dark:border-sand-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
		>
			{/* Thumbnail Placeholder */}
			<div className="h-36 w-full bg-sand-100 dark:bg-sand-900/50 relative overflow-hidden flex items-center justify-center">
				{exercise.coverImage ? (
					<Image 
						src={exercise.coverImage} 
						alt={exercise.title || ""} 
						fill 
						className="object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className={`
						absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity
						${isCompleted ? "bg-gradient-to-tr from-sage-500/20 to-sage-400/20" : "bg-gradient-to-tr from-terra-500/10 to-sage-500/10"}
					`} />
				)}
				
				<div className="relative z-10 drop-shadow-md transition-transform group-hover:scale-110">
					{getIcon()}
				</div>

				{isLocked && (
					<div className="absolute top-3 inset-s-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center">
						<Lock className="w-3 h-3 me-1" /> {libraryT("locked")}
					</div>
				)}
			</div>

			{/* Content Details */}
			<div className="p-5 flex flex-col h-[calc(100%-9rem)]">
				<div className="flex items-center space-x-2 rtl:space-x-reverse text-xs font-medium text-terra-600 dark:text-terra-400 mb-2">
					<span className="bg-terra-100 dark:bg-terra-900/30 px-2 py-0.5 rounded-sm">
						{getTypeLabel(exercise.type)}
					</span>
				</div>

				<h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100 mb-2 group-hover:text-terra-600 dark:group-hover:text-terra-400 transition-colors">
					{t.has(`${exercise.slug}.title`) 
						? t(`${exercise.slug}.title`) 
						: (exercise.title || exercise.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
					}
				</h3>
				
				<p className="text-sm text-sand-600 dark:text-sand-400 line-clamp-2 mb-4">
					{t.has(`${exercise.slug}.description`) 
						? t(`${exercise.slug}.description`) 
						: exercise.description
					}
				</p>

				<div className="flex items-center justify-between text-xs text-sand-500 dark:text-sand-500 border-t border-sand-100 dark:border-sand-800 pt-3 mt-auto">
					<div className="flex items-center space-x-3 rtl:space-x-reverse">
						<span className="flex items-center">
							<Clock className="w-3 h-3 me-1" />
							{t("min", { count: exercise.estimatedTimeMin })}
						</span>
						<span className="flex items-center">
							<Signal className="w-3 h-3 me-1" />
							{libraryT(exercise.difficulty.toLowerCase() as any)}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
