import { Router } from "express";
import { healthController } from "../../../controllers/index.ts";
import { asyncHandler } from "../../../middleware/index.ts";

/**
 * Health check routes
 * Provides multiple health check endpoints for different purposes
 */
const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Basic health check
 *     description: Lightweight health check endpoint for load balancers and uptime monitoring
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                 timestamp:
 *                   type: string
 */
router.get("/", asyncHandler(healthController.basicHealth));

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check
 *     description: Comprehensive health check with system metrics
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get("/detailed", asyncHandler(healthController.detailedHealth));

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness check
 *     description: Kubernetes readiness probe endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is ready
 *       503:
 *         description: Application is not ready
 */
router.get("/ready", asyncHandler(healthController.readinessCheck));

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness check
 *     description: Kubernetes liveness probe endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is alive
 */
router.get("/live", asyncHandler(healthController.livenessCheck));

export default router;
