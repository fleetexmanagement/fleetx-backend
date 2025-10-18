import pino from "pino";
import { config } from "./config.ts";

/**
 * Production-grade logger using Pino
 * - Fast and lightweight
 * - Structured JSON logging in production
 * - Pretty printing in development
 * - Correlation ID support
 */

const loggerConfig = {
	level: config.logLevel,
	...(config.logPretty && config.isDevelopment
		? {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "HH:MM:ss Z",
						ignore: "pid,hostname",
						singleLine: false,
					},
				},
			}
		: {}),
	formatters: {
		level: (label: string) => {
			return { level: label.toUpperCase() };
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	base: {
		env: config.nodeEnv,
		app: config.appName,
	},
};

export const logger = pino(loggerConfig);

/**
 * Create a child logger with additional context
 */
export function createChildLogger(context: Record<string, unknown>) {
	return logger.child(context);
}

/**
 * Logger utility functions
 */
export const log = {
	info: (message: string, data?: Record<string, unknown>) => {
		logger.info(data, message);
	},
	error: (
		message: string,
		error?: Error | unknown,
		data?: Record<string, unknown>,
	) => {
		if (error instanceof Error) {
			logger.error(
				{ ...data, error: error.message, stack: error.stack },
				message,
			);
		} else {
			logger.error({ ...data, error }, message);
		}
	},
	warn: (message: string, data?: Record<string, unknown>) => {
		logger.warn(data, message);
	},
	debug: (message: string, data?: Record<string, unknown>) => {
		logger.debug(data, message);
	},
	fatal: (
		message: string,
		error?: Error | unknown,
		data?: Record<string, unknown>,
	) => {
		if (error instanceof Error) {
			logger.fatal(
				{ ...data, error: error.message, stack: error.stack },
				message,
			);
		} else {
			logger.fatal({ ...data, error }, message);
		}
	},
};
