"use client";

import type { AppExerciseStep as ExerciseStep } from "@/lib/types/app-types";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { useTranslations } from "next-intl";

interface StepTextInputProps {
	step: ExerciseStep;
	value: string;
	onChange: (value: string) => void;
}

export function StepTextInput({ step, value, onChange }: StepTextInputProps) {
	const t = useTranslations("exercises");
	// Simple heuristic: if instruction is long or it's a reflection, use textarea
	const isLongForm = step.type === "REFLECTION" || step.instruction.length > 50;

	return (
		<div className="w-full space-y-6">
			{step.instruction && (
				<p className="text-sand-600 dark:text-sand-400 leading-relaxed text-center">
					{step.instruction}
				</p>
			)}
			
			<div className="w-full">
				{isLongForm ? (
					<Textarea
						value={value}
						onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
						placeholder={t("placeholderResponse")}
						className="min-h-[150px] resize-none bg-white/50 dark:bg-black/20 border-sand-200 dark:border-sand-800 rounded-xl focus-visible:ring-terra-500"
						autoFocus
					/>
				) : (
					<Input
						type="text"
						value={value}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
						placeholder={t("placeholderAnswer")}
						className="h-12 bg-white/50 dark:bg-black/20 border-sand-200 dark:border-sand-800 rounded-xl focus-visible:ring-terra-500"
						autoFocus
					/>
				)}
			</div>
		</div>
	);
}
