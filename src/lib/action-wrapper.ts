import { AppError } from "./errors";

export type ActionState<T = any> = {
	success: boolean;
	data?: T;
	error?: string;
	code?: string;
};

/**
 * Wraps a Server Action to safely catch and format AppError instances.
 * This prevents the application from crashing on expected operational errors
 * and normalizes the return shape for the client.
 *
 * @param action - The async server action to execute
 * @returns A standard ActionState object
 */
export async function safeAction<T>(
	action: () => Promise<T>
): Promise<ActionState<T>> {
	try {
		const data = await action();
		return { success: true, data };
	} catch (error: any) {
		if (error instanceof AppError) {
			// Expected operational error (e.g. ValidationError, AuthError)
			return {
				success: false,
				error: error.message,
				code: error.code,
			};
		}

		// Unexpected errors
		console.error("Unhandled Server Action Error:", error);
		
		// Don't leak stack traces or internal errors to the client
		return {
			success: false,
			error: "An unexpected error occurred. Please try again later.",
			code: "INTERNAL_SERVER_ERROR",
		};
	}
}
