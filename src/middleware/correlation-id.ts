import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import type { ExtendedRequest } from "../types/index.ts";

/**
 * Correlation ID middleware
 * Adds a unique correlation ID to each request for tracking and debugging
 *
 * The correlation ID is:
 * 1. Taken from X-Correlation-ID header if present
 * 2. Generated as a new UUID if not present
 * 3. Added to the response headers
 * 4. Attached to the request object for use in logging
 */
export function correlationId(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const extReq = req as ExtendedRequest;

	// Get correlation ID from header or generate new one
	const correlationId =
		(req.headers["x-correlation-id"] as string) || randomUUID();

	// Attach to request
	extReq.correlationId = correlationId;

	// Add to response headers
	res.setHeader("X-Correlation-ID", correlationId);

	next();
}
