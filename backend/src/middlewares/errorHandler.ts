import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

/**
 * CustomError class for throwing controlled errors with status codes
 */
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

/**
 * Express error handler middleware
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Error:", err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Handle custom errors
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Handle generic JS errors (fallback)
  if (err instanceof Error) {
    return res.status(500).json({
      error: err.message || "Internal Server Error",
    });
  }

  // Unknown errors (non-Error objects)
  return res.status(500).json({
    error: "Unexpected server error",
  });
}
