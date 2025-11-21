import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "../utils/httpErrors";
import asyncHandler from "../utils/asyncHandler";
import { UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";

// Extend the Request object to include the authenticated user
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: UserRole;
}

/**
 * Middleware to verify JWT and attach user details to the request.
 */
export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided.");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new UnauthorizedError("User not found.");
      }

      // Attach user ID and Role to the request
      req.userId = user.id;
      req.userRole = user.role;

      next();
    } catch (error) {
      // JWT errors (e.g., expired, invalid signature) will be caught by the global error handler
      throw error;
    }
  }
);
