import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { config } from "../core/config.ts";
import { AppError } from "../core/errors.ts";
import { log } from "../core/logger.ts";
import { error as errorResponse } from "../core/response.ts";
import type { ExtendedRequest } from "../types/index.ts";

/**
 * Global error handler middleware
 * Catches all errors and sends standardized error responses
 */
export function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	_next: NextFunction,
): void {
	const extReq = req as ExtendedRequest;

	// Default error values
	let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	let code = "INTERNAL_ERROR";
	let message = "An unexpected error occurred";
	let details: unknown;

	// Handle known application errors
	if (err instanceof AppError) {
		statusCode = err.statusCode;
		code = err.code;
		message = err.message;
		details = err.details;

		// Log operational errors as warnings, non-operational as errors
		if (err.isOperational) {
			log.warn("Operational error occurred", {
				correlationId: extReq.correlationId,
				path: req.path,
				method: req.method,
				statusCode,
				code,
				message,
			});
		} else {
			log.error("Non-operational error occurred", err, {
				correlationId: extReq.correlationId,
				path: req.path,
				method: req.method,
			});
		}
	}
	// Handle Zod validation errors
	else if (err instanceof ZodError) {
		statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
		code = "VALIDATION_ERROR";
		const validationError = fromZodError(err);
		message = validationError.message;
		details = err.errors.map((e) => ({
			field: e.path.join("."),
			message: e.message,
			code: e.code,
		}));

		log.warn("Validation error occurred", {
			correlationId: extReq.correlationId,
			path: req.path,
			method: req.method,
			errors: details,
		});
	}
	// Handle unexpected errors
	else {
		log.error("Unhandled error occurred", err, {
			correlationId: extReq.correlationId,
			path: req.path,
			method: req.method,
		});
	}

	// In production, don't expose internal error details
	if (config.isProduction && statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
		message = "An internal error occurred";
		details = undefined;
	}

	// Send error response
	errorResponse(res, message, statusCode, code, details);
}

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
export function asyncHandler<T>(
	fn: (req: Request, res: Response, next: NextFunction) => Promise<T>,
) {
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}
