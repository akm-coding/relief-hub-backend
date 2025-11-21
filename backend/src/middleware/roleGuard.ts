import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../utils/httpErrors";
import { ROLES } from "../config/constants";
import { UserRole } from "@prisma/client";
import { AuthenticatedRequest } from "./authMiddleware";

type AllowedRoles = UserRole | "public";

/**
 * Middleware to check if the authenticated user has one of the required roles.
 * @param allowedRoles A list of roles (UserRole enum values) that are permitted to access the route.
 */
export const roleGuard = (allowedRoles: AllowedRoles[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.userRole;

    if (allowedRoles.includes(ROLES.PUBLIC)) {
      // If 'public' is allowed, no check is needed.
      return next();
    }

    if (!userRole) {
      // User must be authenticated for non-public routes. Auth middleware should run first.
      throw new ForbiddenError("Access denied. Authentication required.");
    }

    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Super Admin bypasses all role checks
    if (userRole === ROLES.SUPER_ADMIN) {
      return next();
    }

    throw new ForbiddenError("Access denied. Insufficient permissions.");
  };
};
