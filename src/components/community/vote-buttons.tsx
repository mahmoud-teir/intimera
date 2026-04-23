"use client";

import { useOptimistic, startTransition } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { vote } from "@/actions/community";
import { useTranslations } from "next-intl";

interface VoteButtonsProps {
	targetId: string;
	type: "post" | "reply";
	initialScore: number;
	initialUserVote: number;
}

export function VoteButtons({ targetId, type, initialScore, initialUserVote }: VoteButtonsProps) {
	const t = useTranslations("community");
	const [optimisticVote, addOptimisticVote] = useOptimistic(
		{ score: initialScore, userVote: initialUserVote },
		(state, newVote: number) => {
			const scoreDiff = newVote - state.userVote;
			return {
				score: state.score + scoreDiff,
				userVote: newVote
			};
		}
	);

	const handleVote = async (value: 1 | -1) => {
		const newValue = optimisticVote.userVote === value ? 0 : value;
		
		startTransition(() => {
			addOptimisticVote(newValue);
		});

		await vote({ targetId, type, value: newValue });
	};

	const upLabel = optimisticVote.userVote === 1 ? t("removeUpvote") : t("upvote");
	const downLabel = optimisticVote.userVote === -1 ? t("removeDownvote") : t("downvote");

	return (
		<div
			className="flex flex-col items-center space-y-1 text-secondary"
			role="group"
			aria-label={t("voteControls", { score: optimisticVote.score })}
		>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					handleVote(1);
				}}
				aria-label={upLabel}
				aria-pressed={optimisticVote.userVote === 1}
				className={`transition-colors rounded p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
					optimisticVote.userVote === 1
						? "text-indigo-600 dark:text-indigo-400"
						: "hover:text-indigo-600"
				}`}
			>
				<ArrowUp size={20} aria-hidden="true" />
			</button>
			<span
				className={`font-medium text-sm ${
					optimisticVote.userVote !== 0
						? "text-indigo-600 dark:text-indigo-400"
						: "text-slate-900 dark:text-white"
				}`}
				aria-live="polite"
				aria-atomic="true"
			>
				{optimisticVote.score}
			</span>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					handleVote(-1);
				}}
				aria-label={downLabel}
				aria-pressed={optimisticVote.userVote === -1}
				className={`transition-colors rounded p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
					optimisticVote.userVote === -1
						? "text-red-600 dark:text-red-400"
						: "hover:text-red-600"
				}`}
			>
				<ArrowDown size={20} aria-hidden="true" />
			</button>
		</div>
	);
}
