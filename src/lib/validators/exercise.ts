import { z } from "zod";

export const exerciseAnswerSchema = z.object({
	promptId: z.string().min(1, "Prompt ID is required"),
	content: z.string().min(1, "Answer cannot be empty"),
});

export const exerciseResponseSchema = z.object({
	exerciseId: z.string().min(1, "Exercise ID is required"),
	answers: z.array(exerciseAnswerSchema).min(1, "At least one answer is required"),
});

export type ExerciseResponseInput = z.infer<typeof exerciseResponseSchema>;

export const checkInSchema = z.object({
	moodScore: z.number().int().min(1, "Mood score must be at least 1").max(10, "Mood score cannot exceed 10"),
	notes: z.string().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
