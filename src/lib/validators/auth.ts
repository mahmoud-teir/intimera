import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters long."),
	email: z.string().email("Please enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters long."),
	ageVerification: z.boolean().refine((val) => val === true, {
		message: "You must be 18 or older to use this service.",
	}),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const resetPasswordRequestSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
});

export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;

export const resetPasswordSchema = z.object({
	password: z.string().min(8, "Password must be at least 8 characters long."),
	confirmPassword: z.string().min(8, "Password must be at least 8 characters long."),
	token: z.string().min(1, "Reset token is required."),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match.",
	path: ["confirmPassword"],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
