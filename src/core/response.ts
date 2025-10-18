import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type {
	ApiError,
	ApiResponse,
	ExtendedRequest,
	PaginatedResponse,
	PaginationMeta,
} from "../types/index.ts";

/**
 * Standardized API response utilities
 * Ensures consistent response format across all endpoints
 */

/**
 * Send successful response
 */
export function success<T = unknown>(
	res: Response,
	data?: T,
	message?: string,
	statusCode: number = StatusCodes.OK,
): Response {
	const req = res.req as ExtendedRequest;

	const response: ApiResponse<T> = {
		success: true,
		message,
		data,
		timestamp: new Date().toISOString(),
		path: req.originalUrl || req.url,
		correlationId: req.correlationId,
	};

	return res.status(statusCode).json(response);
}

/**
 * Send created response (201)
 */
export function created<T = unknown>(
	res: Response,
	data?: T,
	message: string = "Resource created successfully",
): Response {
	return success(res, data, message, StatusCodes.CREATED);
}

/**
 * Send no content response (204)
 */
export function noContent(res: Response): Response {
	return res.status(StatusCodes.NO_CONTENT).send();
}

/**
 * Send error response
 */
export function error(
	res: Response,
	message: string,
	statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
	code: string = "INTERNAL_ERROR",
	details?: unknown,
): Response {
	const req = res.req as ExtendedRequest;

	const errorObj: ApiError = {
		code,
		message,
		details,
	};

	const response: ApiResponse = {
		success: false,
		error: errorObj,
		timestamp: new Date().toISOString(),
		path: req.originalUrl || req.url,
		correlationId: req.correlationId,
	};

	return res.status(statusCode).json(response);
}

/**
 * Send paginated response
 */
export function paginated<T = unknown>(
	res: Response,
	data: T[],
	page: number,
	limit: number,
	total: number,
	message?: string,
): Response {
	const req = res.req as ExtendedRequest;

	const totalPages = Math.ceil(total / limit);

	const meta: PaginationMeta = {
		page,
		limit,
		total,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	};

	const response: PaginatedResponse<T> = {
		success: true,
		message,
		data,
		meta,
		timestamp: new Date().toISOString(),
		path: req.originalUrl || req.url,
		correlationId: req.correlationId,
	};

	return res.status(StatusCodes.OK).json(response);
}
