import { Router } from "express";
import { exampleController } from "../../../controllers/index.ts";
import {
	asyncHandler,
	validateBody,
	validateParams,
	validateQuery,
} from "../../../middleware/index.ts";
import {
	createItemSchema,
	itemIdSchema,
	paginationSchema,
	updateItemSchema,
} from "./schemas/item.schema.ts";

/**
 * Items routes (v1)
 * Example CRUD endpoints with validation
 */
const router = Router();

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Get all items
 *     description: Retrieve a paginated list of items
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of items with pagination
 */
router.get(
	"/",
	validateQuery(paginationSchema),
	asyncHandler(exampleController.getAllItems),
);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   get:
 *     summary: Get item by ID
 *     description: Retrieve a single item by its ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item details
 *       404:
 *         description: Item not found
 */
router.get(
	"/:id",
	validateParams(itemIdSchema),
	asyncHandler(exampleController.getItemById),
);

/**
 * @swagger
 * /api/v1/items:
 *   post:
 *     summary: Create new item
 *     description: Create a new item with name and description
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Item created successfully
 *       422:
 *         description: Validation error
 */
router.post(
	"/",
	validateBody(createItemSchema),
	asyncHandler(exampleController.createItem),
);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   put:
 *     summary: Update item
 *     description: Update an existing item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 */
router.put(
	"/:id",
	validateParams(itemIdSchema),
	validateBody(updateItemSchema),
	asyncHandler(exampleController.updateItem),
);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   delete:
 *     summary: Delete item
 *     description: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete(
	"/:id",
	validateParams(itemIdSchema),
	asyncHandler(exampleController.deleteItem),
);

/**
 * @swagger
 * /api/v1/items/error:
 *   get:
 *     summary: Trigger error (for testing)
 *     description: Intentionally triggers an error to test error handling
 *     tags: [Items]
 *     responses:
 *       400:
 *         description: Bad request error
 */
router.get("/error/test", asyncHandler(exampleController.triggerError));

export default router;
