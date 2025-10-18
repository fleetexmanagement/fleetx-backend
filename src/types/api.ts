import type { Request } from "express";

/**
 * Standard API response format
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	message?: string;
	data?: T;
	error?: ApiError;
	timestamp: string;
	path: string;
	correlationId?: string;
}

/**
 * API Error structure
 */
export interface ApiError {
	code: string;
	message: string;
	details?: unknown;
	stack?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	meta: PaginationMeta;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
	status: "healthy" | "unhealthy" | "degraded";
	timestamp: string;
	uptime: number;
	version: string;
	environment: string;
	services?: Record<string, ServiceHealth>;
	system?: SystemMetrics;
}

/**
 * Service health status
 */
export interface ServiceHealth {
	status: "up" | "down" | "degraded";
	message?: string;
	responseTime?: number;
	lastChecked: string;
}

/**
 * System metrics
 */
export interface SystemMetrics {
	memory: {
		used: number;
		total: number;
		percentage: number;
	};
	cpu: {
		usage: number;
	};
	process: {
		uptime: number;
		pid: number;
	};
}

/**
 * Extended Express Request with custom properties
 */
export interface ExtendedRequest extends Request {
	correlationId?: string;
	startTime?: number;
}

/**
 * Validation error details
 */
export interface ValidationError {
	field: string;
	message: string;
	code?: string;
}
