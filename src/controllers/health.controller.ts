import type { Request, Response } from "express";
import { success } from "../core/response.ts";
import { getBasicHealthCheck, getDetailedHealthCheck } from "../utils/index.ts";

/**
 * Health check controller
 * Provides health check endpoints for monitoring and load balancers
 */

/**
 * Basic health check
 * Lightweight endpoint for load balancers and uptime monitoring
 *
 * @route GET /health
 */
export async function basicHealth(
	_req: Request,
	res: Response,
): Promise<Response> {
	const health = getBasicHealthCheck();
	return success(res, health, "Service is healthy");
}

/**
 * Detailed health check
 * Provides comprehensive health information including system metrics
 *
 * @route GET /health/detailed
 */
export async function detailedHealth(
	_req: Request,
	res: Response,
): Promise<Response> {
	const health = getDetailedHealthCheck();
	return success(res, health, "Detailed health check completed");
}

/**
 * Readiness check
 * Indicates if the application is ready to receive traffic
 * Used by Kubernetes and similar orchestration systems
 *
 * @route GET /health/ready
 */
export async function readinessCheck(
	_req: Request,
	res: Response,
): Promise<Response> {
	const health = getBasicHealthCheck();

	// Add any readiness checks here (database connections, required services, etc.)
	const isReady = health.status === "healthy";

	if (isReady) {
		return success(res, health, "Application is ready");
	}

	return res.status(503).json({
		success: false,
		message: "Application is not ready",
		data: health,
		timestamp: new Date().toISOString(),
	});
}

/**
 * Liveness check
 * Indicates if the application is running
 * Used by Kubernetes to determine if the pod should be restarted
 *
 * @route GET /health/live
 */
export async function livenessCheck(
	_req: Request,
	res: Response,
): Promise<Response> {
	return success(res, { alive: true }, "Application is alive");
}
