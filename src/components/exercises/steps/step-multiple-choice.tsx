"use client";

import type { AppExerciseStep as ExerciseStep } from "@/lib/types/app-types";
import { Check } from "lucide-react";

interface StepMultipleChoiceProps {
	step: ExerciseStep;
	value: string;
	onChange: (value: string) => void;
}

export function StepMultipleChoice({ step, value, onChange }: StepMultipleChoiceProps) {
	// Parse options from JSON string
	let options: string[] = [];
	try {
		options = step.options ? JSON.parse(step.options) : [];
	} catch (e) {
		console.error("Failed to parse options for step", step.id);
	}

	return (
		<div className="w-full space-y-6 text-center">
			{step.instruction && (
				<p className="text-sand-600 dark:text-sand-400 leading-relaxed mb-6">
					{step.instruction}
				</p>
			)}
			
			<div className="space-y-3">
				{options.map((opt, idx) => {
					const isSelected = value === opt;
					return (
						<button
							key={idx}
							onClick={() => onChange(opt)}
							className={`
								w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left
								${isSelected 
									? "border-terra-500 bg-terra-50 dark:bg-terra-900/20 ring-1 ring-terra-500" 
									: "border-sand-200 dark:border-sand-800 bg-white/50 dark:bg-black/20 hover:bg-sand-50 dark:hover:bg-white/5"
								}
							`}
						>
							<span className={`font-medium ${isSelected ? "text-terra-900 dark:text-terra-100" : "text-sand-700 dark:text-sand-300"}`}>
								{opt}
							</span>
							
							<div className={`
								w-6 h-6 rounded-full flex items-center justify-center border
								${isSelected ? "bg-terra-500 border-terra-500" : "border-sand-300 dark:border-sand-700"}
							`}>
								{isSelected && <Check className="w-4 h-4 text-white" />}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
