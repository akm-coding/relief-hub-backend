import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodIssue } from "zod";
import { BadRequestError } from "../utils/httpErrors";

/**
 * Middleware to validate request data (body, params, query) using a Zod schema.
 * @param schema The Zod schema object containing validation rules for request components.
 */
const validate =
  (schema: {
    body?: AnyZodObject;
    params?: AnyZodObject;
    query?: AnyZodObject;
  }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      next();
    } catch (error: any) {
      // If the error is a ZodError, it will be handled by the global error handler
      // But we ensure it's re-thrown to trigger the chain
      if (error.issues) {
        // Re-throw ZodError to be caught by the errorHandler for detailed issue reporting
        throw error;
      }
      // Catch-all for other parsing/validation issues
      throw new BadRequestError("Invalid request data.");
    }
  };

export default validate;
