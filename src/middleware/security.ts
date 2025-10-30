import compression from "compression";
import cors from "cors";
import type { Express } from "express";
import helmet from "helmet";
import { config } from "../core/config.ts";

/**
 * Configure security middleware
 * Sets up Helmet, CORS, and compression
 */
export function configureSecurity(app: Express): void {
	// Helmet - Security headers
	if (config.helmetEnabled) {
		app.use(
			helmet({
				contentSecurityPolicy: {
					directives: {
						defaultSrc: ["'self'"],
						styleSrc: ["'self'", "'unsafe-inline'"],
						scriptSrc: ["'self'", "'unsafe-inline'"],
						imgSrc: ["'self'", "data:", "https:"],
					},
				},
				crossOriginEmbedderPolicy: false,
				crossOriginResourcePolicy: { policy: "cross-origin" },
			}),
		);
	}

	// CORS - Cross-Origin Resource Sharing
	app.use(
		cors({
			origin: config.corsOrigin,
			credentials: config.corsCredentials,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowedHeaders: [
				"Content-Type",
				"Authorization",
				"X-Correlation-ID",
				"X-Request-ID",
			],
			exposedHeaders: ["X-Correlation-ID", "X-Request-ID"],
		}),
	);

	// Compression - Gzip compression
	app.use(
		compression({
			filter: (req, res) => {
				// Don't compress if client doesn't support it
				if (req.headers["x-no-compression"]) {
					return false;
				}
				// Use compression for all other requests
				return compression.filter(req, res);
			},
			level: 6, // Compression level (0-9)
			threshold: 1024, // Only compress responses larger than 1KB
		}),
	);

	// Trust proxy if enabled (for proper IP detection behind load balancers)
	if (config.trustProxy) {
		app.set("trust proxy", true);
	}
}
