import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";


export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }
  try {
    const decoded = verifyToken(token) as { userId: string, email: string };
req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
}
