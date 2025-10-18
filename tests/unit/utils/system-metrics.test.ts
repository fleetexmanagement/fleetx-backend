import { describe, expect, it } from "@jest/globals";
import {
	formatUptime,
	getCpuMetrics,
	getMemoryMetrics,
	getProcessUptime,
	getSystemMetrics,
	getSystemUptime,
} from "../../../src/utils/system-metrics.ts";

describe("System Metrics", () => {
	describe("getMemoryMetrics", () => {
		it("should return memory metrics", () => {
			const metrics = getMemoryMetrics();

			expect(metrics).toHaveProperty("used");
			expect(metrics).toHaveProperty("total");
			expect(metrics).toHaveProperty("percentage");
			expect(metrics).toHaveProperty("process");
			expect(typeof metrics.used).toBe("number");
			expect(typeof metrics.total).toBe("number");
			expect(typeof metrics.percentage).toBe("number");
			expect(metrics.percentage).toBeGreaterThanOrEqual(0);
			expect(metrics.percentage).toBeLessThanOrEqual(100);
		});
	});

	describe("getCpuMetrics", () => {
		it("should return CPU metrics", () => {
			const metrics = getCpuMetrics();

			expect(metrics).toHaveProperty("usage");
			expect(metrics).toHaveProperty("cores");
			expect(metrics).toHaveProperty("model");
			expect(typeof metrics.usage).toBe("number");
			expect(typeof metrics.cores).toBe("number");
			expect(typeof metrics.model).toBe("string");
			expect(metrics.cores).toBeGreaterThan(0);
		});
	});

	describe("getProcessUptime", () => {
		it("should return process uptime", () => {
			const uptime = getProcessUptime();

			expect(typeof uptime).toBe("number");
			expect(uptime).toBeGreaterThanOrEqual(0);
		});
	});

	describe("getSystemUptime", () => {
		it("should return system uptime", () => {
			const uptime = getSystemUptime();

			expect(typeof uptime).toBe("number");
			expect(uptime).toBeGreaterThan(0);
		});
	});

	describe("getSystemMetrics", () => {
		it("should return all system metrics", () => {
			const metrics = getSystemMetrics();

			expect(metrics).toHaveProperty("memory");
			expect(metrics).toHaveProperty("cpu");
			expect(metrics).toHaveProperty("process");
			expect(metrics.memory).toHaveProperty("used");
			expect(metrics.cpu).toHaveProperty("usage");
			expect(metrics.process).toHaveProperty("uptime");
			expect(metrics.process).toHaveProperty("pid");
		});
	});

	describe("formatUptime", () => {
		it("should format uptime correctly", () => {
			expect(formatUptime(0)).toBe("0s");
			expect(formatUptime(30)).toBe("30s");
			expect(formatUptime(60)).toBe("1m");
			expect(formatUptime(90)).toBe("1m 30s");
			expect(formatUptime(3600)).toBe("1h");
			expect(formatUptime(3661)).toBe("1h 1m 1s");
			expect(formatUptime(86400)).toBe("1d");
			expect(formatUptime(90061)).toBe("1d 1h 1m 1s");
		});
	});
});
