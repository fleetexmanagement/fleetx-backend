import { z } from "zod";

/**
 * Environment variables schema with validation
 * All environment variables are validated at startup
 */
const envSchema = z.object({
	// Application
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.string().default("3000").transform(Number),
	APP_NAME: z.string().default("backend-express"),
	API_VERSION: z.string().default("v1"),

	// CORS
	CORS_ORIGIN: z.string().default("*"),
	CORS_CREDENTIALS: z
		.string()
		.default("true")
		.transform((val) => val === "true"),

	// Rate Limiting
	RATE_LIMIT_WINDOW_MS: z.string().default("900000").transform(Number),
	RATE_LIMIT_MAX_REQUESTS: z.string().default("100").transform(Number),

	// Logging
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace"])
		.default("info"),
	LOG_PRETTY: z
		.string()
		.default("true")
		.transform((val) => val === "true"),

	// Security
	HELMET_ENABLED: z
		.string()
		.default("true")
		.transform((val) => val === "true"),
	TRUST_PROXY: z
		.string()
		.default("false")
		.transform((val) => val === "true"),

	// Health Check
	HEALTH_CHECK_PATH: z.string().default("/health"),
	METRICS_ENABLED: z
		.string()
		.default("true")
		.transform((val) => val === "true"),
});

export type Environment = z.infer<typeof envSchema>;

/**
 * Validates and returns typed environment variables
 * @throws {Error} If validation fails
 */
export function validateEnv(): Environment {
	try {
		return envSchema.parse(process.env);
	} catch (error) {
		console.error("❌ Invalid environment variables:", error);
		process.exit(1);
	}
}
