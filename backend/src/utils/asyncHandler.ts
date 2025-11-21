import { Request, Response, NextFunction } from "express";

/**
 * Wraps an Express route handler to catch errors and pass them to the error middleware.
 * @param fn The express route handler function (req, res, next)
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
