import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "@/lib/auth.ts";

type AuthUser = { role?: string; [k: string]: unknown };
type RequestWithAuth = Request & { user?: AuthUser; session?: unknown };

export async function requireSession(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});
		if (!session) {
			return res.status(401).json({ error: "Unauthorized" });
		}
		// attach for downstream handlers
		const r = req as RequestWithAuth;
		r.user = session.user as AuthUser;
		r.session = session as unknown;
		return next();
	} catch {
		return res.status(401).json({ error: "Unauthorized" });
	}
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
	const user = (req as RequestWithAuth).user;
	if (!user || (user.role !== "admin" && user.role !== "ADMIN")) {
		return res.status(403).json({ error: "Forbidden" });
	}
	return next();
}
