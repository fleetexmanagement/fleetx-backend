import type { Express } from "express";
// @ts-expect-error - swagger-jsdoc doesn't have full type definitions
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "../core/config.ts";
import { getAppVersion } from "../utils/system-metrics.ts";

/**
 * Swagger/OpenAPI configuration
 * Auto-generates API documentation from JSDoc comments
 */

const swaggerOptions: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: config.appName,
			version: getAppVersion(),
			description:
				"Production-ready Express.js backend starter template with TypeScript, featuring comprehensive API documentation, request validation, error handling, and health checks.",
			contact: {
				name: "API Support",
				email: "support@example.com",
			},
			license: {
				name: "MIT",
				url: "https://opensource.org/licenses/MIT",
			},
		},
		servers: [
			{
				url: `http://localhost:${config.port}`,
				description: "Development server",
			},
			{
				url: "https://api.example.com",
				description: "Production server",
			},
		],
		tags: [
			{
				name: "Health",
				description: "Health check endpoints for monitoring and load balancers",
			},
			{
				name: "Items",
				description:
					"Example CRUD operations for items (demonstration purposes)",
			},
		],
		components: {
			schemas: {
				ApiResponse: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							description: "Indicates if the request was successful",
						},
						message: {
							type: "string",
							description: "Human-readable message",
						},
						data: {
							type: "object",
							description: "Response data",
						},
						error: {
							type: "object",
							properties: {
								code: {
									type: "string",
									description: "Error code",
								},
								message: {
									type: "string",
									description: "Error message",
								},
								details: {
									type: "object",
									description: "Additional error details",
								},
							},
						},
						timestamp: {
							type: "string",
							format: "date-time",
							description: "ISO 8601 timestamp",
						},
						path: {
							type: "string",
							description: "Request path",
						},
						correlationId: {
							type: "string",
							description: "Request correlation ID for tracing",
						},
					},
				},
				PaginatedResponse: {
					allOf: [
						{
							$ref: "#/components/schemas/ApiResponse",
						},
						{
							type: "object",
							properties: {
								meta: {
									type: "object",
									properties: {
										page: {
											type: "number",
											description: "Current page number",
										},
										limit: {
											type: "number",
											description: "Items per page",
										},
										total: {
											type: "number",
											description: "Total number of items",
										},
										totalPages: {
											type: "number",
											description: "Total number of pages",
										},
										hasNext: {
											type: "boolean",
											description: "Has next page",
										},
										hasPrev: {
											type: "boolean",
											description: "Has previous page",
										},
									},
								},
							},
						},
					],
				},
				Error: {
					type: "object",
					properties: {
						success: {
							type: "boolean",
							example: false,
						},
						error: {
							type: "object",
							properties: {
								code: {
									type: "string",
									example: "NOT_FOUND",
								},
								message: {
									type: "string",
									example: "Resource not found",
								},
								details: {
									type: "object",
								},
							},
						},
						timestamp: {
							type: "string",
							format: "date-time",
						},
						path: {
							type: "string",
						},
						correlationId: {
							type: "string",
						},
					},
				},
			},
			responses: {
				BadRequest: {
					description: "Bad Request",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				Unauthorized: {
					description: "Unauthorized",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				Forbidden: {
					description: "Forbidden",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				NotFound: {
					description: "Not Found",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				ValidationError: {
					description: "Validation Error",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				TooManyRequests: {
					description: "Too Many Requests",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
				InternalServerError: {
					description: "Internal Server Error",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Error",
							},
						},
					},
				},
			},
		},
	},
	apis: ["./src/app/routes/**/*.ts"], // Path to route files with JSDoc comments
};

// Generate Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Setup Swagger UI
 */
export function setupSwagger(app: Express): void {
	// Swagger JSON endpoint
	app.get("/api-docs.json", (_req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(swaggerSpec);
	});

	// Swagger UI
	app.use(
		"/api-docs",
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, {
			customCss: ".swagger-ui .topbar { display: none }",
			customSiteTitle: `${config.appName} API Documentation`,
			customfavIcon: "/favicon.ico",
			swaggerOptions: {
				persistAuthorization: true,
				displayRequestDuration: true,
				filter: true,
				tryItOutEnabled: true,
			},
		}),
	);
}
