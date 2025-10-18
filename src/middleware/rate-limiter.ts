import rateLimit from "express-rate-limit";
import { config } from "../core/config.ts";
import { log } from "../core/logger.ts";
import type { ExtendedRequest } from "../types/index.ts";

/**
 * Rate limiting middleware
 * Protects API from abuse and DDoS attacks
 *
 * Configuration:
 * - Window: Time window for rate limiting (from env)
 * - Max: Maximum requests per window (from env)
 * - Standard headers: Includes RateLimit-* headers
 * - Skip successful requests: Only count failed requests
 */
export const rateLimiter = rateLimit({
	windowMs: config.rateLimitWindowMs, // Time window
	max: config.rateLimitMaxRequests, // Max requests per window
	message: {
		success: false,
		error: {
			code: "TOO_MANY_REQUESTS",
			message: "Too many requests, please try again later.",
		},
		timestamp: new Date().toISOString(),
	},
	standardHeaders: true, // Return rate limit info in headers
	legacyHeaders: false, // Disable X-RateLimit-* headers
	handler: (req, res, _next, options) => {
		const extReq = req as ExtendedRequest;
		log.warn("Rate limit exceeded", {
			correlationId: extReq.correlationId,
			ip: req.ip,
			path: req.path,
			method: req.method,
		});
		res.status(options.statusCode).json(options.message);
	},
	skip: (req) => {
		// Skip rate limiting for health checks
		return req.path.includes("/health");
	},
	keyGenerator: (req) => {
		// Use IP address as rate limit key
		// In production with load balancer, consider using X-Forwarded-For
		return req.ip || "unknown";
	},
	skipSuccessfulRequests: false, // Count all requests
	skipFailedRequests: false,
});

/**
 * Strict rate limiter for sensitive endpoints
 * More restrictive than the default rate limiter
 */
export const strictRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // 5 requests per window
	message: {
		success: false,
		error: {
			code: "TOO_MANY_REQUESTS",
			message:
				"Too many requests to this endpoint, please try again after 15 minutes.",
		},
		timestamp: new Date().toISOString(),
	},
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res, _next, options) => {
		const extReq = req as ExtendedRequest;
		log.warn("Strict rate limit exceeded", {
			correlationId: extReq.correlationId,
			ip: req.ip,
			path: req.path,
			method: req.method,
		});
		res.status(options.statusCode).json(options.message);
	},
	keyGenerator: (req) => req.ip || "unknown",
});
