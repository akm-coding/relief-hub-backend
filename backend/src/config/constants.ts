import { UserRole } from "@prisma/client";

export const ROLES = {
  SUPER_ADMIN: "super_admin" as UserRole,
  ADMIN: "admin" as UserRole,
  RESPONDER: "responder" as UserRole,
  VOLUNTEER: "volunteer" as UserRole,
  CITIZEN: "citizen" as UserRole,
  PUBLIC: "public", // Used for unauthenticated access
};

export const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "1h";
export const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";
export const SALT_ROUNDS = 10;
