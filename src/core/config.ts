import dotenv from "dotenv";
import { type Environment, validateEnv } from "../types/index.ts";

// Load environment variables
dotenv.config();

/**
 * Application configuration
 * Validated environment variables with type safety
 */
class Config {
	private static instance: Config;
	private env: Environment;

	private constructor() {
		this.env = validateEnv();
	}

	public static getInstance(): Config {
		if (!Config.instance) {
			Config.instance = new Config();
		}
		return Config.instance;
	}

	// Application
	get nodeEnv(): string {
		return this.env.NODE_ENV;
	}

	get port(): number {
		return this.env.PORT;
	}

	get appName(): string {
		return this.env.APP_NAME;
	}

	get apiVersion(): string {
		return this.env.API_VERSION;
	}

	get isDevelopment(): boolean {
		return this.env.NODE_ENV === "development";
	}

	get isProduction(): boolean {
		return this.env.NODE_ENV === "production";
	}

	get isTest(): boolean {
		return this.env.NODE_ENV === "test";
	}

	// CORS
	get corsOrigin(): string | string[] {
		const origin = this.env.CORS_ORIGIN;
		return origin.includes(",")
			? origin.split(",").map((o) => o.trim())
			: origin;
	}

	get corsCredentials(): boolean {
		return this.env.CORS_CREDENTIALS;
	}

	// Rate Limiting
	get rateLimitWindowMs(): number {
		return this.env.RATE_LIMIT_WINDOW_MS;
	}

	get rateLimitMaxRequests(): number {
		return this.env.RATE_LIMIT_MAX_REQUESTS;
	}

	// Logging
	get logLevel(): string {
		return this.env.LOG_LEVEL;
	}

	get logPretty(): boolean {
		return this.env.LOG_PRETTY;
	}

	// Security
	get helmetEnabled(): boolean {
		return this.env.HELMET_ENABLED;
	}

	get trustProxy(): boolean {
		return this.env.TRUST_PROXY;
	}

	// Health Check
	get healthCheckPath(): string {
		return this.env.HEALTH_CHECK_PATH;
	}

	get metricsEnabled(): boolean {
		return this.env.METRICS_ENABLED;
	}

	/**
	 * Get all configuration as object
	 */
	public getAll(): Environment {
		return { ...this.env };
	}
}

// Export singleton instance
export const config = Config.getInstance();
