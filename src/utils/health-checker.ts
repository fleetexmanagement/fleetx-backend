import { config } from "../core/config.ts";
import { log } from "../core/logger.ts";
import type { HealthCheckResponse, ServiceHealth } from "../types/index.ts";
import {
	getAppVersion,
	getProcessUptime,
	getSystemMetrics,
} from "./system-metrics.ts";

/**
 * Health check utilities
 * Provides detailed health status of the application and its dependencies
 */

/**
 * Check if service is healthy based on various metrics
 */
function determineOverallHealth(
	services?: Record<string, ServiceHealth>,
): "healthy" | "unhealthy" | "degraded" {
	if (!services || Object.keys(services).length === 0) {
		return "healthy";
	}

	const statuses = Object.values(services).map((s) => s.status);

	// If any service is down, overall status is unhealthy
	if (statuses.includes("down")) {
		return "unhealthy";
	}

	// If any service is degraded, overall status is degraded
	if (statuses.includes("degraded")) {
		return "degraded";
	}

	// All services are up
	return "healthy";
}

/**
 * Perform basic health check
 */
export function getBasicHealthCheck(): HealthCheckResponse {
	return {
		status: "healthy",
		timestamp: new Date().toISOString(),
		uptime: getProcessUptime(),
		version: getAppVersion(),
		environment: config.nodeEnv,
	};
}

/**
 * Perform detailed health check with system metrics
 */
export function getDetailedHealthCheck(): HealthCheckResponse {
	try {
		const systemMetrics = config.metricsEnabled
			? getSystemMetrics()
			: undefined;

		// Check if memory usage is too high (over 90%)
		let status: "healthy" | "unhealthy" | "degraded" = "healthy";
		if (systemMetrics && systemMetrics.memory.percentage > 90) {
			status = "degraded";
			log.warn("High memory usage detected", {
				memoryPercentage: systemMetrics.memory.percentage,
			});
		}

		return {
			status,
			timestamp: new Date().toISOString(),
			uptime: getProcessUptime(),
			version: getAppVersion(),
			environment: config.nodeEnv,
			system: systemMetrics,
		};
	} catch (error) {
		log.error("Error performing health check", error);
		return {
			status: "unhealthy",
			timestamp: new Date().toISOString(),
			uptime: getProcessUptime(),
			version: getAppVersion(),
			environment: config.nodeEnv,
		};
	}
}

/**
 * Check external service health
 * Example implementation - customize based on your services
 */
export async function checkExternalService(
	name: string,
	checkFn: () => Promise<boolean>,
): Promise<ServiceHealth> {
	const startTime = Date.now();
	try {
		const isHealthy = await checkFn();
		const responseTime = Date.now() - startTime;

		return {
			status: isHealthy ? "up" : "down",
			message: isHealthy ? "Service is operational" : "Service is down",
			responseTime,
			lastChecked: new Date().toISOString(),
		};
	} catch (error) {
		const responseTime = Date.now() - startTime;
		const message = error instanceof Error ? error.message : "Unknown error";

		log.error(`Health check failed for ${name}`, error);

		return {
			status: "down",
			message: `Service check failed: ${message}`,
			responseTime,
			lastChecked: new Date().toISOString(),
		};
	}
}

/**
 * Perform comprehensive health check with external services
 */
export async function getComprehensiveHealthCheck(
	externalChecks?: Record<string, () => Promise<boolean>>,
): Promise<HealthCheckResponse> {
	try {
		const systemMetrics = config.metricsEnabled
			? getSystemMetrics()
			: undefined;

		// Perform external service checks if provided
		let services: Record<string, ServiceHealth> | undefined;
		if (externalChecks) {
			services = {};
			for (const [name, checkFn] of Object.entries(externalChecks)) {
				services[name] = await checkExternalService(name, checkFn);
			}
		}

		const status = determineOverallHealth(services);

		return {
			status,
			timestamp: new Date().toISOString(),
			uptime: getProcessUptime(),
			version: getAppVersion(),
			environment: config.nodeEnv,
			services,
			system: systemMetrics,
		};
	} catch (error) {
		log.error("Error performing comprehensive health check", error);
		return {
			status: "unhealthy",
			timestamp: new Date().toISOString(),
			uptime: getProcessUptime(),
			version: getAppVersion(),
			environment: config.nodeEnv,
		};
	}
}
