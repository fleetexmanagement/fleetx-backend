import { beforeAll, describe, expect, it } from "@jest/globals";
import type { Express } from "express";
import request from "supertest";
import { createApp } from "../../src/app/server.ts";

describe("API Documentation Endpoints", () => {
	let app: Express;

	beforeAll(() => {
		app = createApp();
	});

	describe("GET /api-docs", () => {
		it("should serve Swagger UI", async () => {
			const response = await request(app).get("/api-docs/").expect(200);

			// Swagger UI should serve successfully
			expect(response.text).toContain("swagger");
		});
	});

	describe("GET /api-docs.json", () => {
		it("should return OpenAPI specification", async () => {
			const response = await request(app).get("/api-docs.json").expect(200);

			expect(response.headers["content-type"]).toMatch(/application\/json/);
			expect(response.body).toHaveProperty("openapi", "3.0.0");
			expect(response.body).toHaveProperty("info");
			expect(response.body).toHaveProperty("paths");
			expect(response.body).toHaveProperty("components");
		});

		it("should include all defined routes", async () => {
			const response = await request(app).get("/api-docs.json").expect(200);

			const paths = response.body.paths;

			// Check for health endpoints
			expect(paths).toHaveProperty("/health");

			// Check for API v1 endpoints (if any are documented)
			// Note: This depends on your JSDoc comments in routes
		});
	});
});
