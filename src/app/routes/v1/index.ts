import { Router } from "express";
import itemsRoutes from "./items/items.routes.ts";
import sessionRoutes from "./session/session.routes.ts";

/**
 * API v1 routes
 * Main router for version 1 of the API
 */
const router = Router();

// Mount routes
router.use("/items", itemsRoutes);
router.use("/auth/session", sessionRoutes);

export default router;
