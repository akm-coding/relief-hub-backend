import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/httpErrors";

/**
 * Global Error Handling Middleware
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Determine the status code and message
  let statusCode = 500;
  let message = "An unexpected server error occurred.";

  if (err instanceof HttpError) {
    // Operational errors (e.g., 400, 401, 404, 403)
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "JsonWebTokenError") {
    // JWT validation errors
    statusCode = 401;
    message = "Invalid token.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired.";
  } else if (err.name === "ZodError") {
    // Zod validation errors
    statusCode = 400;
    message = "Validation failed.";
    // Optional: send detailed Zod errors
    const issues = err.issues.map((issue: any) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(statusCode).json({
      status: "error",
      message: message,
      issues: issues,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Log the error in development mode
  if (process.env.NODE_ENV === "development" && statusCode === 500) {
    console.error("SERVER ERROR:", err);
  }

  // Send the structured error response
  res.status(statusCode).json({
    status: "error",
    message: message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
