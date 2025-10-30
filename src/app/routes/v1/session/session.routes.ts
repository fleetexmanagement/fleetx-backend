import { fromNodeHeaders } from "better-auth/node";
import { Router } from "express";
import { auth } from "@/lib/auth.ts";

/**
 * Session routes (v1)
 * Get the session of the user
 */
const router = Router();

/**
 * @swagger
 * /api/v1/session/me:
 *   get:
 *     summary: Get the session of the user
 *     description: Get the session of the user
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Session of the user
 */
router.get("/me", async (req, res) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});
	return res.json(session);
});

export default router;
