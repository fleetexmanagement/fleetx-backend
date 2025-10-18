import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
	validate,
	validateBody,
	validateParams,
	validateQuery,
} from "../../../src/middleware/validator.ts";

describe("Validator Middleware", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		mockRequest = {
			body: {},
			query: {},
			params: {},
		};
		mockResponse = {};
		mockNext = jest.fn() as NextFunction;
	});

	describe("validate", () => {
		it("should validate body successfully", async () => {
			const schema = z.object({
				name: z.string(),
				age: z.number(),
			});

			mockRequest.body = { name: "John", age: 30 };

			const middleware = validate({ body: schema });
			await middleware(
				mockRequest as Request,
				mockResponse as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
			expect(mockRequest.body).toEqual({ name: "John", age: 30 });
		});

		it("should validate query successfully", async () => {
			const schema = z.object({
				page: z.string().transform(Number),
			});

			mockRequest.query = { page: "1" };

			const middleware = validate({ query: schema });
			await middleware(
				mockRequest as Request,
				mockResponse as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
			expect(mockRequest.query).toEqual({ page: 1 });
		});

		it("should validate params successfully", async () => {
			const schema = z.object({
				id: z.string(),
			});

			mockRequest.params = { id: "123" };

			const middleware = validate({ params: schema });
			await middleware(
				mockRequest as Request,
				mockResponse as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
			expect(mockRequest.params).toEqual({ id: "123" });
		});

		it("should call next with error on validation failure", async () => {
			const schema = z.object({
				name: z.string(),
				age: z.number(),
			});

			mockRequest.body = { name: "John" }; // Missing age

			const middleware = validate({ body: schema });
			await middleware(
				mockRequest as Request,
				mockResponse as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
		});
	});

	describe("validateBody", () => {
		it("should validate body using simplified function", async () => {
			const schema = z.object({
				email: z.string().email(),
			});

			mockRequest.body = { email: "test@example.com" };

			const middleware = validateBody(schema);
			await middleware(
				mockRequest as Request,
				mockResponse as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
		});
	});

	describe("validateQuery", () => {
		it("should validate query using simplified function", async () => {
			const schema = z.object({
				search: z.string().optional(),
			});

			mockRequest.query = { search: "test" };

			const middleware = validateQuery(schema);
			await middleware(
				mockRequest as Request,
				mockResponse as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
		});
	});

	describe("validateParams", () => {
		it("should validate params using simplified function", async () => {
			const schema = z.object({
				id: z.string().uuid(),
			});

			mockRequest.params = { id: "550e8400-e29b-41d4-a716-446655440000" };

			const middleware = validateParams(schema);
			await middleware(
				mockRequest as Request,
				mockResponse as Response,
				mockNext,
			);

			expect(mockNext).toHaveBeenCalledWith();
		});
	});
});
