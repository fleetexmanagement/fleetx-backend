import { beforeAll, describe, expect, it } from "@jest/globals";
import type { Express } from "express";
import request from "supertest";
import { createApp } from "../../src/app/server.ts";

describe("Items API Endpoints", () => {
	let app: Express;

	beforeAll(() => {
		app = createApp();
	});

	describe("GET /api/v1/items", () => {
		it("should return paginated items", async () => {
			const response = await request(app)
				.get("/api/v1/items")
				.query({ page: 1, limit: 10 })
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toBeInstanceOf(Array);
			expect(response.body).toHaveProperty("meta");
			expect(response.body.meta).toHaveProperty("page", 1);
			expect(response.body.meta).toHaveProperty("limit", 10);
			expect(response.body.meta).toHaveProperty("total");
			expect(response.body.meta).toHaveProperty("totalPages");
			expect(response.body.meta).toHaveProperty("hasNext");
			expect(response.body.meta).toHaveProperty("hasPrev");
		});

		it("should use default pagination values", async () => {
			const response = await request(app).get("/api/v1/items").expect(200);

			expect(response.body.meta.page).toBe(1);
			expect(response.body.meta.limit).toBe(10);
		});

		it("should validate page parameter", async () => {
			const response = await request(app)
				.get("/api/v1/items")
				.query({ page: -1 })
				.expect(422);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("VALIDATION_ERROR");
		});
	});

	describe("GET /api/v1/items/:id", () => {
		it("should return a single item", async () => {
			const response = await request(app).get("/api/v1/items/1").expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id", "1");
			expect(response.body.data).toHaveProperty("name");
			expect(response.body.data).toHaveProperty("description");
		});

		it("should return 404 for non-existent item", async () => {
			const response = await request(app).get("/api/v1/items/999").expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("NOT_FOUND");
		});
	});

	describe("POST /api/v1/items", () => {
		it("should create a new item", async () => {
			const newItem = {
				name: "Test Item",
				description: "Test Description",
			};

			const response = await request(app)
				.post("/api/v1/items")
				.send(newItem)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.name).toBe(newItem.name);
			expect(response.body.data.description).toBe(newItem.description);
		});

		it("should validate required fields", async () => {
			const response = await request(app)
				.post("/api/v1/items")
				.send({})
				.expect(422);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("VALIDATION_ERROR");
		});

		it("should validate field constraints", async () => {
			const response = await request(app)
				.post("/api/v1/items")
				.send({
					name: "",
					description: "Test",
				})
				.expect(422);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("VALIDATION_ERROR");
		});
	});

	describe("PUT /api/v1/items/:id", () => {
		it("should update an existing item", async () => {
			const updates = {
				name: "Updated Name",
				description: "Updated Description",
			};

			const response = await request(app)
				.put("/api/v1/items/1")
				.send(updates)
				.expect(200);

			expect(response.body.success).toBe(true);
			expect(response.body.data.name).toBe(updates.name);
			expect(response.body.data.description).toBe(updates.description);
		});

		it("should return 404 for non-existent item", async () => {
			const response = await request(app)
				.put("/api/v1/items/999")
				.send({ name: "Test" })
				.expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("NOT_FOUND");
		});
	});

	describe("DELETE /api/v1/items/:id", () => {
		it("should delete an item", async () => {
			const response = await request(app).delete("/api/v1/items/1").expect(200);

			expect(response.body.success).toBe(true);
		});

		it("should return 404 for non-existent item", async () => {
			const response = await request(app)
				.delete("/api/v1/items/999")
				.expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("NOT_FOUND");
		});
	});

	describe("Error Handling", () => {
		it("should handle intentional errors correctly", async () => {
			const response = await request(app)
				.get("/api/v1/items/error/test")
				.expect(400);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("BAD_REQUEST");
			expect(response.body).toHaveProperty("correlationId");
		});
	});

	describe("404 Not Found", () => {
		it("should return 404 for non-existent routes", async () => {
			const response = await request(app)
				.get("/api/v1/non-existent")
				.expect(404);

			expect(response.body.success).toBe(false);
			expect(response.body.error.code).toBe("NOT_FOUND");
		});
	});
});
