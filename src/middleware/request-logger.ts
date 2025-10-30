import pinoHttp from "pino-http";
import { logger } from "../core/logger.ts";

/**
 * HTTP request logger middleware using pino-http
 * Logs all incoming requests and responses with timing information
 */
export const requestLogger = pinoHttp({
	// biome-ignore lint/suspicious/noExplicitAny: <>
	logger: logger as any, // Type workaround for pino-http compatibility
	customLogLevel: (_req, res, err) => {
		if (res.statusCode >= 500 || err) return "error";
		if (res.statusCode >= 400) return "warn";
		return "info";
	},
	customSuccessMessage: (req, res) => {
		// biome-ignore lint/suspicious/noExplicitAny: <>
		const contentLength = (res as any).getHeader
			? // biome-ignore lint/suspicious/noExplicitAny: <>
				(res as any).getHeader("content-length")
			: 0;
		return `${req.method} ${req.url} ${res.statusCode} - ${contentLength || 0}b`;
	},
	customErrorMessage: (_req, _res, err) => {
		return `Request error: ${err.message}`;
	},
	customAttributeKeys: {
		req: "request",
		res: "response",
		err: "error",
		responseTime: "duration",
	},
	serializers: {
		req: (req) => {
			return {
				// biome-ignore lint/suspicious/noExplicitAny: <>
				id: (req as any).correlationId,
				method: req.method,
				url: req.url,
				path: req.raw?.url,
				headers: {
					host: req.headers.host,
					userAgent: req.headers["user-agent"],
					contentType: req.headers["content-type"],
				},
				remoteAddress: req.raw?.socket?.remoteAddress,
				remotePort: req.raw?.socket?.remotePort,
			};
		},
		res: (res) => {
			// biome-ignore lint/suspicious/noExplicitAny: <>
			const rawRes = (res as any).raw || res;
			return {
				statusCode: res.statusCode,
				headers: {
					contentType: rawRes.getHeader
						? rawRes.getHeader("content-type")
						: undefined,
					contentLength: rawRes.getHeader
						? rawRes.getHeader("content-length")
						: undefined,
				},
			};
		},
	},
	autoLogging: {
		ignore: (req) => {
			// Don't log health check requests to reduce noise
			return req.url?.includes("/health") || false;
		},
	},
});
