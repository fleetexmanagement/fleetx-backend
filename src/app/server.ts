import express, { type Express } from "express";
import { config } from "../core/config.ts";
import { log } from "../core/logger.ts";
import {
	configureSecurity,
	correlationId,
	errorHandler,
	notFoundHandler,
	rateLimiter,
	requestLogger,
} from "../middleware/index.ts";
import routes from "./routes/index.ts";
import { setupSwagger } from "./swagger.ts";

/**
 * Production-ready Express server
 * Features:
 * - Security headers (Helmet)
 * - CORS configuration
 * - Request compression
 * - Rate limiting
 * - Request correlation IDs
 * - Structured logging (Pino)
 * - Error handling
 * - API versioning
 * - Swagger documentation
 * - Health checks
 * - Graceful shutdown
 */

/**
 * Create and configure Express application
 */
function createApp(): Express {
	const app = express();

	// Trust proxy (for load balancers)
	if (config.trustProxy) {
		app.set("trust proxy", 1);
	}

	// Security middleware (Helmet, CORS, Compression)
	configureSecurity(app);

	// Body parsers
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ extended: true, limit: "10mb" }));

	// Correlation ID middleware (must be before logging)
	app.use(correlationId);

	// Request logging
	if (!config.isTest) {
		app.use(requestLogger);
	}

	// Rate limiting
	app.use(rateLimiter);

	// API Documentation
	setupSwagger(app);

	// Routes
	app.use(routes);

	// 404 handler (must be after all routes)
	app.use(notFoundHandler);

	// Global error handler (must be last)
	app.use(errorHandler);

	return app;
}

/**
 * Start the server
 */
async function startServer(): Promise<void> {
	try {
		const app = createApp();

		const server = app.listen(config.port, () => {
			log.info(`🚀 Server started successfully`, {
				port: config.port,
				environment: config.nodeEnv,
				version: "1.0.0",
				pid: process.pid,
			});

			log.info(
				`📚 API Documentation: http://localhost:${config.port}/api-docs`,
			);
			log.info(`💚 Health Check: http://localhost:${config.port}/health`);
			log.info(`🔗 API Base URL: http://localhost:${config.port}/api/v1`);
		});

		// Graceful shutdown
		const gracefulShutdown = async (signal: string) => {
			log.info(`${signal} received, starting graceful shutdown`);

			// Close server to stop accepting new connections
			server.close(() => {
				log.info("Server closed, no longer accepting connections");

				// Close database connections, cleanup resources, etc.
				// Add your cleanup logic here

				log.info("Graceful shutdown completed");
				process.exit(0);
			});

			// Force shutdown after timeout
			setTimeout(() => {
				log.error("Forced shutdown due to timeout");
				process.exit(1);
			}, 10000); // 10 seconds timeout
		};

		// Handle shutdown signals
		process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
		process.on("SIGINT", () => gracefulShutdown("SIGINT"));

		// Handle uncaught exceptions
		process.on("uncaughtException", (error: Error) => {
			log.fatal("Uncaught exception", error);
			gracefulShutdown("uncaughtException");
		});

		// Handle unhandled promise rejections
		process.on("unhandledRejection", (reason: unknown) => {
			log.fatal("Unhandled promise rejection", reason as Error);
			gracefulShutdown("unhandledRejection");
		});
	} catch (error) {
		log.fatal("Failed to start server", error as Error);
		process.exit(1);
	}
}

// Start server if this file is executed directly
// Fixed for Bun compatibility
const isMainModule =
	import.meta.main || import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
	startServer();
}

// Export for testing
export { createApp, startServer };
