import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof Error) {
    const status = err.message === "Unauthorized" ? 401 : 500;
    return res.status(status).json({
      error: err.message,
    });
  }

  res.status(500).json({ error: "Unexpected server error" });
}
