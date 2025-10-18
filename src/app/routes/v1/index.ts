import { Router } from "express";
import itemsRoutes from "./items.routes.ts";

/**
 * API v1 routes
 * Main router for version 1 of the API
 */
const router = Router();

// Mount routes
router.use("/items", itemsRoutes);

export default router;
