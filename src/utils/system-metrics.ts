import { readFileSync } from "node:fs";
import os from "node:os";
import type { SystemMetrics } from "../types/index.ts";

/**
 * System metrics utilities
 * Collects system-level metrics for health checks
 */

/**
 * Get memory usage metrics
 */
export function getMemoryMetrics() {
	const memoryUsage = process.memoryUsage();
	const totalMemory = os.totalmem();
	const freeMemory = os.freemem();
	const usedMemory = totalMemory - freeMemory;

	return {
		used: Math.round(usedMemory / 1024 / 1024), // MB
		total: Math.round(totalMemory / 1024 / 1024), // MB
		percentage: Math.round((usedMemory / totalMemory) * 100),
		process: {
			heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
			heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
			external: Math.round(memoryUsage.external / 1024 / 1024), // MB
			rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
		},
	};
}

/**
 * Get CPU usage metrics
 * Note: Returns average CPU usage across all cores
 */
export function getCpuMetrics() {
	const cpus = os.cpus();
	let totalIdle = 0;
	let totalTick = 0;

	for (const cpu of cpus) {
		for (const type in cpu.times) {
			totalTick += cpu.times[type as keyof typeof cpu.times];
		}
		totalIdle += cpu.times.idle;
	}

	const idle = totalIdle / cpus.length;
	const total = totalTick / cpus.length;
	const usage = 100 - Math.floor((idle / total) * 100);

	return {
		usage,
		cores: cpus.length,
		model: cpus[0]?.model || "Unknown",
	};
}

/**
 * Get process uptime
 */
export function getProcessUptime(): number {
	return Math.floor(process.uptime());
}

/**
 * Get system uptime
 */
export function getSystemUptime(): number {
	return Math.floor(os.uptime());
}

/**
 * Get all system metrics
 */
export function getSystemMetrics(): SystemMetrics {
	return {
		memory: getMemoryMetrics(),
		cpu: getCpuMetrics(),
		process: {
			uptime: getProcessUptime(),
			pid: process.pid,
		},
	};
}

/**
 * Get application version from package.json
 */
export function getAppVersion(): string {
	try {
		const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
		return packageJson.version || "1.0.0";
	} catch {
		return "1.0.0";
	}
}

/**
 * Format uptime to human-readable string
 */
export function formatUptime(seconds: number): string {
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	const parts: string[] = [];
	if (days > 0) parts.push(`${days}d`);
	if (hours > 0) parts.push(`${hours}h`);
	if (minutes > 0) parts.push(`${minutes}m`);
	if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

	return parts.join(" ");
}
