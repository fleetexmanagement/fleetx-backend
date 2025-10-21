import { toNodeHandler } from "better-auth/node";
import { Router } from "express";
import { auth } from "@/lib/auth.ts";
import itemsRoutes from "./items/items.routes.ts";

/**
 * API v1 routes
 * Main router for version 1 of the API
 */
const router = Router();

// Mount routes
router.use("/items", itemsRoutes);
router.all("/auth/*splat", toNodeHandler(auth));

export default router;
