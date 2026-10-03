import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "./jwt.js";

export type AuthenticatedRequest = Request & {
  userId: number;
};

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.header("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }

  try {
    const payload = verifyAccessToken(token);

    if (!Number.isInteger(payload.userId)) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    (req as AuthenticatedRequest).userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}
