import { z } from "zod";
import { UserRole } from "@prisma/client";

export const IdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID format."),
});

export const UpdateMeSchema = z.object({
  firstName: z.string().min(1, "First name is required.").optional(),
  lastName: z.string().min(1, "Last name is required.").optional(),
  phone: z.string().optional(),
  // Note: Email/Role/Password updates are separate or handled differently
});

export type UpdateMeDto = z.infer<typeof UpdateMeSchema>;

export const UpdateRoleSchema = z.object({
  role: z.nativeEnum(UserRole, {
    required_error: "Role is required.",
    invalid_type_error: "Invalid role value.",
  }),
});

export type UpdateRoleDto = z.infer<typeof UpdateRoleSchema>;
