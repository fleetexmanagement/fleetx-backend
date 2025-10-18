import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject, ZodSchema } from "zod";

/**
 * Request validation middleware using Zod schemas
 * Validates request body, query params, and route params
 */
export function validate(schemas: {
	body?: ZodSchema;
	query?: ZodSchema;
	params?: ZodSchema;
}) {
	return async (
		req: Request,
		_res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			// Validate body
			if (schemas.body) {
				req.body = await schemas.body.parseAsync(req.body);
			}

			// Validate query parameters
			if (schemas.query) {
				const validatedQuery = await schemas.query.parseAsync(req.query);
				Object.assign(req.query, validatedQuery);
			}

			// Validate route parameters
			if (schemas.params) {
				const validatedParams = await schemas.params.parseAsync(req.params);
				Object.assign(req.params, validatedParams);
			}

			next();
		} catch (error) {
			// Zod errors are handled by error handler middleware
			next(error);
		}
	};
}

/**
 * Simplified validator for body only
 */
export function validateBody(schema: AnyZodObject) {
	return validate({ body: schema });
}

/**
 * Simplified validator for query params only
 */
export function validateQuery(schema: AnyZodObject) {
	return validate({ query: schema });
}

/**
 * Simplified validator for route params only
 */
export function validateParams(schema: AnyZodObject) {
	return validate({ params: schema });
}
