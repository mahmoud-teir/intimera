"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { completeExercise } from "@/actions/exercises";
import type { AppExercise as Exercise, AppExerciseStep as ExerciseStep } from "@/lib/types/app-types";

// Step Component Imports (we will create these next)
import { StepTextInput } from "./steps/step-text-input";
import { StepMultipleChoice } from "./steps/step-multiple-choice";
import { StepScaleSlider } from "./steps/step-scale-slider";

import { useTranslations } from "next-intl";

interface ExerciseWizardProps {
	exercise: Exercise;
	steps: ExerciseStep[];
}

export function ExerciseWizard({ exercise, steps }: ExerciseWizardProps) {
	const router = useRouter();
	const t = useTranslations("exercises");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [responses, setResponses] = useState<Record<string, any>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCompleted, setIsCompleted] = useState(false);
	const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

	const currentStep = steps[currentIndex];
	const isLastStep = currentIndex === steps.length - 1;
	const progressPercentage = ((currentIndex) / steps.length) * 100;

	const handleNext = () => {
		if (!isLastStep) {
			setDirection(1);
			setCurrentIndex(prev => prev + 1);
		} else {
			handleSubmit();
		}
	};

	const handlePrev = () => {
		if (currentIndex > 0) {
			setDirection(-1);
			setCurrentIndex(prev => prev - 1);
		}
	};

	const updateResponse = (stepId: string, value: any) => {
		setResponses(prev => ({ ...prev, [stepId]: value }));
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		
		const res = await completeExercise(exercise.id, responses);
		
		setIsSubmitting(false);
		if (res.success) {
			setIsCompleted(true);
		} else {
			alert(res.error || t("submitError"));
		}
	};

	const renderStepContent = (step: ExerciseStep) => {
		const value = responses[step.id];

		switch (step.type) {
			case "TEXT_INPUT":
			case "REFLECTION":
				return <StepTextInput step={step} value={value || ""} onChange={(val) => updateResponse(step.id, val)} />;
			case "MULTIPLE_CHOICE":
				return <StepMultipleChoice step={step} value={value || ""} onChange={(val) => updateResponse(step.id, val)} />;
			case "SCALE_SLIDER":
				return <StepScaleSlider step={step} value={value || 5} onChange={(val) => updateResponse(step.id, val)} />;
			case "TEXT_PROMPT":
			default:
				// Just an instructional step
				return (
					<div className="text-center py-8">
						<p className="text-sand-600 dark:text-sand-400 text-lg leading-relaxed">{step.instruction}</p>
					</div>
				);
		}
	};

	// Animation Variants
	const variants = {
		enter: (direction: number) => {
			return {
				x: direction > 0 ? 1000 : -1000,
				opacity: 0
			};
		},
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1
		},
		exit: (direction: number) => {
			return {
				zIndex: 0,
				x: direction < 0 ? 1000 : -1000,
				opacity: 0
			};
		}
	};

	if (isCompleted) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto">
				<motion.div 
					initial={{ scale: 0 }} 
					animate={{ scale: 1 }} 
					className="w-24 h-24 bg-sage-100 dark:bg-sage-900/50 rounded-full flex items-center justify-center mb-6"
				>
					<CheckCircle2 className="w-12 h-12 text-sage-600 dark:text-sage-400" />
				</motion.div>
				<h2 className="text-3xl font-light text-sand-900 dark:text-sand-100 mb-4">
					{t("completedTitle")}
				</h2>
				<p className="text-sand-600 dark:text-sand-400 mb-8 leading-relaxed">
					{t("completedDescription")}
				</p>
				<Button 
					onClick={() => router.push("/exercises")}
					className="bg-terra-500 hover:bg-terra-600 text-white rounded-xl px-8 h-12"
				>
					{t("exploreMore")}
				</Button>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto flex flex-col min-h-[60vh] py-8" dir="ltr">
			{/* Progress Bar - force LTR for consistent progress direction across all languages */}
			<div className="mb-10" dir="ltr">
				<div className="flex justify-between text-xs text-sand-500 font-medium mb-3">
					<span dir="auto">{t("stepOf", { current: currentIndex + 1, total: steps.length })}</span>
					<span>{Math.round(progressPercentage)}%</span>
				</div>
				<div className="w-full h-2 bg-sand-100 dark:bg-sand-900/50 rounded-full overflow-hidden">
					<motion.div 
						className="h-full bg-terra-500 rounded-full"
						initial={{ width: `${((currentIndex) / steps.length) * 100}%` }}
						animate={{ width: `${progressPercentage}%` }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					/>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 relative overflow-hidden flex flex-col justify-center min-h-[300px]" dir="auto">
				<AnimatePresence initial={false} custom={direction} mode="wait">
					<motion.div
						key={currentIndex}
						custom={direction}
						variants={variants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{
							x: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 }
						}}
						className="w-full absolute inset-0 flex flex-col items-center justify-center"
					>
						<h2 className="text-2xl font-semibold text-sand-900 dark:text-sand-100 mb-8 text-center max-w-xl">
							{currentStep.title}
						</h2>
						
						<div className="w-full max-w-lg">
							{renderStepContent(currentStep)}
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Navigation Footer */}
			<div className="mt-12 pt-6 border-t border-sand-100 dark:border-sand-800/50 flex items-center justify-between" dir="auto">
				<Button
					variant="ghost"
					onClick={handlePrev}
					disabled={currentIndex === 0 || isSubmitting}
					className="text-sand-600 dark:text-sand-400"
				>
					<ArrowLeft className="w-4 h-4 mr-2 rtl:rotate-180" /> {t("back")}
				</Button>

				<Button
					onClick={handleNext}
					disabled={isSubmitting}
					className={`
						px-8 rounded-xl h-11
						${isLastStep ? "bg-sage-600 hover:bg-sage-700 text-white" : "bg-black dark:bg-white text-white dark:text-black"}
					`}
				>
					{isSubmitting ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<>
							{isLastStep ? t("complete") : t("next")} 
							{!isLastStep && <ArrowRight className="w-4 h-4 ml-2 rtl:rotate-180" />}
						</>
					)}
				</Button>
			</div>
			
		</div>
	);
}
