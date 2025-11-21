import { z } from "zod";
import { UserRole } from "@prisma/client";

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.citizen).optional(), // Default to citizen, admin roles must be set by an admin later
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format."),
  password: z.string().min(1, "Password is required."),
});

export type LoginDto = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required."),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>;
