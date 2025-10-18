import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../core/errors.ts";

/**
 * 404 Not Found handler
 * Catches all requests that don't match any routes
 */
export function notFoundHandler(
	req: Request,
	_res: Response,
	next: NextFunction,
): void {
	const error = new NotFoundError(`Route ${req.method} ${req.path} not found`, {
		method: req.method,
		path: req.path,
		availableRoutes: ["/health", "/api/v1", "/api-docs"],
	});
	next(error);
}
