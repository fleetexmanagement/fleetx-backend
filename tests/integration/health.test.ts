import { beforeAll, describe, expect, it } from "@jest/globals";
import type { Express } from "express";
import request from "supertest";
import { createApp } from "../../src/app/server.ts";

describe("Health Check Endpoints", () => {
	let app: Express;

	beforeAll(() => {
		app = createApp();
	});

	describe("GET /health", () => {
		it("should return basic health status", async () => {
			const response = await request(app).get("/health").expect(200);

			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("message");
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("status", "healthy");
			expect(response.body.data).toHaveProperty("timestamp");
			expect(response.body.data).toHaveProperty("uptime");
			expect(response.body.data).toHaveProperty("version");
			expect(response.body.data).toHaveProperty("environment", "test");
		});

		it("should include correlation ID in response", async () => {
			const response = await request(app).get("/health").expect(200);

			expect(response.body).toHaveProperty("correlationId");
			expect(response.headers).toHaveProperty("x-correlation-id");
		});

		it("should accept custom correlation ID", async () => {
			const customId = "test-correlation-id-123";
			const response = await request(app)
				.get("/health")
				.set("X-Correlation-ID", customId)
				.expect(200);

			expect(response.body.correlationId).toBe(customId);
			expect(response.headers["x-correlation-id"]).toBe(customId);
		});
	});

	describe("GET /health/detailed", () => {
		it("should return detailed health status with metrics", async () => {
			const response = await request(app).get("/health/detailed").expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("status");
			expect(response.body.data).toHaveProperty("system");
			expect(response.body.data.system).toHaveProperty("memory");
			expect(response.body.data.system).toHaveProperty("cpu");
			expect(response.body.data.system).toHaveProperty("process");
		});
	});

	describe("GET /health/ready", () => {
		it("should return readiness status", async () => {
			const response = await request(app).get("/health/ready").expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("status");
		});
	});

	describe("GET /health/live", () => {
		it("should return liveness status", async () => {
			const response = await request(app).get("/health/live").expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("alive", true);
		});
	});
});
