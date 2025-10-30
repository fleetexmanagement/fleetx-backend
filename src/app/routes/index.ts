import { Router } from "express";
import healthRoutes from "./health/health.routes.ts";
import Routes from "./v1/index.ts";

/**
 * Main router
 * Combines all route modules
 */
const router = Router();

// Health check routes (unversioned)
router.use("/health", healthRoutes);
// API v1 routes
router.use("/api", Routes);

export default router;
