import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../core/errors.ts";
import { created, paginated, success } from "../core/response.ts";

/**
 * Example controller
 * Demonstrates best practices for building API controllers
 */

// Mock data for demonstration
const mockItems = [
	{
		id: "1",
		name: "Item 1",
		description: "First item",
		createdAt: new Date().toISOString(),
	},
	{
		id: "2",
		name: "Item 2",
		description: "Second item",
		createdAt: new Date().toISOString(),
	},
	{
		id: "3",
		name: "Item 3",
		description: "Third item",
		createdAt: new Date().toISOString(),
	},
	{
		id: "4",
		name: "Item 4",
		description: "Fourth item",
		createdAt: new Date().toISOString(),
	},
	{
		id: "5",
		name: "Item 5",
		description: "Fifth item",
		createdAt: new Date().toISOString(),
	},
];

/**
 * Get all items with pagination
 * @route GET /api/v1/items
 */
export async function getAllItems(
	req: Request,
	res: Response,
): Promise<Response> {
	// Get pagination params from validated query
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;

	// Calculate pagination
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;

	// Get paginated data
	const paginatedItems = mockItems.slice(startIndex, endIndex);
	const total = mockItems.length;

	return paginated(
		res,
		paginatedItems,
		page,
		limit,
		total,
		"Items retrieved successfully",
	);
}

/**
 * Get single item by ID
 * @route GET /api/v1/items/:id
 */
export async function getItemById(
	req: Request,
	res: Response,
): Promise<Response> {
	const { id } = req.params;

	const item = mockItems.find((item) => item.id === id);

	if (!item) {
		throw new NotFoundError(`Item with ID ${id} not found`);
	}

	return success(res, item, "Item retrieved successfully");
}

/**
 * Create new item
 * @route POST /api/v1/items
 */
export async function createItem(
	req: Request,
	res: Response,
): Promise<Response> {
	const { name, description } = req.body;

	// Create new item
	const newItem = {
		id: String(mockItems.length + 1),
		name,
		description,
		createdAt: new Date().toISOString(),
	};

	mockItems.push(newItem);

	return created(res, newItem, "Item created successfully");
}

/**
 * Update item
 * @route PUT /api/v1/items/:id
 */
export async function updateItem(
	req: Request,
	res: Response,
): Promise<Response> {
	const { id } = req.params;
	const { name, description } = req.body;

	const itemIndex = mockItems.findIndex((item) => item.id === id);

	if (itemIndex === -1) {
		throw new NotFoundError(`Item with ID ${id} not found`);
	}

	// Update item
	const existingItem = mockItems[itemIndex];
	if (existingItem) {
		mockItems[itemIndex] = {
			...existingItem,
			name,
			description,
		};
	}

	return success(res, mockItems[itemIndex], "Item updated successfully");
}

/**
 * Delete item
 * @route DELETE /api/v1/items/:id
 */
export async function deleteItem(
	req: Request,
	res: Response,
): Promise<Response> {
	const { id } = req.params;

	const itemIndex = mockItems.findIndex((item) => item.id === id);

	if (itemIndex === -1) {
		throw new NotFoundError(`Item with ID ${id} not found`);
	}

	// Remove item
	mockItems.splice(itemIndex, 1);

	return success(res, null, "Item deleted successfully");
}

/**
 * Example error endpoint
 * @route GET /api/v1/items/error
 */
export async function triggerError(
	_req: Request,
	_res: Response,
): Promise<Response> {
	throw new BadRequestError("This is an intentional error for testing", {
		testField: "test value",
	});
}
