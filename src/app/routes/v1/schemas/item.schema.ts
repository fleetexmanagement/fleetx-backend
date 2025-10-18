import { z } from "zod";

/**
 * Zod schemas for item validation
 * Provides type-safe request validation
 */

/**
 * Schema for creating an item
 */
export const createItemSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters")
		.trim(),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description must be less than 500 characters")
		.trim(),
});

/**
 * Schema for updating an item
 */
export const updateItemSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required")
		.max(100, "Name must be less than 100 characters")
		.trim()
		.optional(),
	description: z
		.string()
		.min(1, "Description is required")
		.max(500, "Description must be less than 500 characters")
		.trim()
		.optional(),
});

/**
 * Schema for item ID parameter
 */
export const itemIdSchema = z.object({
	id: z.string().min(1, "ID is required"),
});

/**
 * Schema for pagination query parameters
 */
export const paginationSchema = z.object({
	page: z
		.string()
		.optional()
		.default("1")
		.transform(Number)
		.refine((val) => val > 0, "Page must be greater than 0"),
	limit: z
		.string()
		.optional()
		.default("10")
		.transform(Number)
		.refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
});

/**
 * Type exports for TypeScript
 */
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type ItemIdInput = z.infer<typeof itemIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
