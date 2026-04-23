"use client";

import type { AppExerciseStep as ExerciseStep } from "@/lib/types/app-types";

interface StepScaleSliderProps {
	step: ExerciseStep;
	value: number;
	onChange: (value: number) => void;
}

export function StepScaleSlider({ step, value, onChange }: StepScaleSliderProps) {
	// For MVP, hardcode 1 to 10 scale
	const min = 1;
	const max = 10;

	return (
		<div className="w-full space-y-8 text-center">
			{step.instruction && (
				<p className="text-sand-600 dark:text-sand-400 leading-relaxed mb-6">
					{step.instruction}
				</p>
			)}
			
			<div className="relative pt-6 pb-2">
				<div className="text-5xl font-light text-terra-500 mb-8">
					{value}
				</div>

				<input
					type="range"
					min={min}
					max={max}
					value={value}
					onChange={(e) => onChange(parseInt(e.target.value))}
					className="w-full h-2 bg-sand-200 dark:bg-sand-800 rounded-lg appearance-none cursor-pointer accent-terra-500"
				/>
				
				<div className="flex justify-between text-xs text-sand-500 font-medium mt-4 px-1">
					<span>Strongly Disagree (1)</span>
					<span>Strongly Agree (10)</span>
				</div>
			</div>
		</div>
	);
}
