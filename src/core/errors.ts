import { StatusCodes } from "http-status-codes";

/**
 * Base Application Error
 * All custom errors extend this class
 */
export class AppError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly isOperational: boolean;
	public readonly details?: unknown;

	constructor(
		message: string,
		statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
		code: string = "INTERNAL_ERROR",
		isOperational: boolean = true,
		details?: unknown,
	) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);

		this.statusCode = statusCode;
		this.code = code;
		this.isOperational = isOperational;
		this.details = details;

		Error.captureStackTrace(this);
	}
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends AppError {
	constructor(message: string = "Bad Request", details?: unknown) {
		super(message, StatusCodes.BAD_REQUEST, "BAD_REQUEST", true, details);
	}
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends AppError {
	constructor(message: string = "Unauthorized", details?: unknown) {
		super(message, StatusCodes.UNAUTHORIZED, "UNAUTHORIZED", true, details);
	}
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends AppError {
	constructor(message: string = "Forbidden", details?: unknown) {
		super(message, StatusCodes.FORBIDDEN, "FORBIDDEN", true, details);
	}
}

/**
 * 404 Not Found
 */
export class NotFoundError extends AppError {
	constructor(message: string = "Resource not found", details?: unknown) {
		super(message, StatusCodes.NOT_FOUND, "NOT_FOUND", true, details);
	}
}

/**
 * 409 Conflict
 */
export class ConflictError extends AppError {
	constructor(message: string = "Conflict", details?: unknown) {
		super(message, StatusCodes.CONFLICT, "CONFLICT", true, details);
	}
}

/**
 * 422 Unprocessable Entity (Validation Error)
 */
export class ValidationError extends AppError {
	constructor(message: string = "Validation failed", details?: unknown) {
		super(
			message,
			StatusCodes.UNPROCESSABLE_ENTITY,
			"VALIDATION_ERROR",
			true,
			details,
		);
	}
}

/**
 * 429 Too Many Requests
 */
export class TooManyRequestsError extends AppError {
	constructor(message: string = "Too many requests", details?: unknown) {
		super(
			message,
			StatusCodes.TOO_MANY_REQUESTS,
			"TOO_MANY_REQUESTS",
			true,
			details,
		);
	}
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends AppError {
	constructor(message: string = "Internal server error", details?: unknown) {
		super(
			message,
			StatusCodes.INTERNAL_SERVER_ERROR,
			"INTERNAL_ERROR",
			false,
			details,
		);
	}
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends AppError {
	constructor(message: string = "Service unavailable", details?: unknown) {
		super(
			message,
			StatusCodes.SERVICE_UNAVAILABLE,
			"SERVICE_UNAVAILABLE",
			true,
			details,
		);
	}
}
