/**
 * Intimera Error Classes
 * Typed error hierarchy for consistent error handling across the app.
 */

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly isOperational: boolean;

	constructor(
		message: string,
		statusCode = 500,
		code = "INTERNAL_ERROR",
		isOperational = true,
	) {
		super(message);
		this.name = this.constructor.name;
		this.statusCode = statusCode;
		this.code = code;
		this.isOperational = isOperational;
		Error.captureStackTrace(this, this.constructor);
	}
}

export class AuthError extends AppError {
	constructor(message = "Authentication required") {
		super(message, 401, "AUTH_ERROR");
	}
}

export class ForbiddenError extends AppError {
	constructor(message = "Access denied") {
		super(message, 403, "FORBIDDEN");
	}
}

export class NotFoundError extends AppError {
	constructor(resource = "Resource") {
		super(`${resource} not found`, 404, "NOT_FOUND");
	}
}

export class ValidationError extends AppError {
	public readonly errors: Record<string, string[]>;

	constructor(
		message = "Validation failed",
		errors: Record<string, string[]> = {},
	) {
		super(message, 422, "VALIDATION_ERROR");
		this.errors = errors;
	}
}

export class SubscriptionError extends AppError {
	constructor(message = "Premium subscription required") {
		super(message, 402, "SUBSCRIPTION_REQUIRED");
	}
}

export class RateLimitError extends AppError {
	public readonly retryAfter: number;

	constructor(retryAfter = 60) {
		super("Too many requests", 429, "RATE_LIMIT");
		this.retryAfter = retryAfter;
	}
}
