import { describe, expect, it } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import {
	AppError,
	BadRequestError,
	ForbiddenError,
	InternalServerError,
	NotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../../../src/core/errors.ts";

describe("Core Errors", () => {
	describe("AppError", () => {
		it("should create an AppError with default values", () => {
			const error = new AppError("Test error");

			expect(error).toBeInstanceOf(Error);
			expect(error.message).toBe("Test error");
			expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(error.code).toBe("INTERNAL_ERROR");
			expect(error.isOperational).toBe(true);
		});

		it("should create an AppError with custom values", () => {
			const error = new AppError(
				"Custom error",
				StatusCodes.BAD_REQUEST,
				"CUSTOM_CODE",
				false,
				{ field: "test" },
			);

			expect(error.message).toBe("Custom error");
			expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
			expect(error.code).toBe("CUSTOM_CODE");
			expect(error.isOperational).toBe(false);
			expect(error.details).toEqual({ field: "test" });
		});
	});

	describe("BadRequestError", () => {
		it("should create a BadRequestError", () => {
			const error = new BadRequestError("Invalid input");

			expect(error).toBeInstanceOf(AppError);
			expect(error.message).toBe("Invalid input");
			expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
			expect(error.code).toBe("BAD_REQUEST");
			expect(error.isOperational).toBe(true);
		});
	});

	describe("NotFoundError", () => {
		it("should create a NotFoundError", () => {
			const error = new NotFoundError("Resource not found");

			expect(error).toBeInstanceOf(AppError);
			expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
			expect(error.code).toBe("NOT_FOUND");
		});
	});

	describe("ValidationError", () => {
		it("should create a ValidationError", () => {
			const error = new ValidationError("Validation failed");

			expect(error).toBeInstanceOf(AppError);
			expect(error.statusCode).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
			expect(error.code).toBe("VALIDATION_ERROR");
		});
	});

	describe("UnauthorizedError", () => {
		it("should create an UnauthorizedError", () => {
			const error = new UnauthorizedError();

			expect(error).toBeInstanceOf(AppError);
			expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
			expect(error.code).toBe("UNAUTHORIZED");
		});
	});

	describe("ForbiddenError", () => {
		it("should create a ForbiddenError", () => {
			const error = new ForbiddenError();

			expect(error).toBeInstanceOf(AppError);
			expect(error.statusCode).toBe(StatusCodes.FORBIDDEN);
			expect(error.code).toBe("FORBIDDEN");
		});
	});

	describe("InternalServerError", () => {
		it("should create an InternalServerError", () => {
			const error = new InternalServerError();

			expect(error).toBeInstanceOf(AppError);
			expect(error.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
			expect(error.code).toBe("INTERNAL_ERROR");
			expect(error.isOperational).toBe(false);
		});
	});
});
