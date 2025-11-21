import { z } from "zod";
import { WarningLevel } from "@prisma/client";
import { IdParamSchema } from "../../users/dto/user.dto";

export const WarningIdParamSchema = IdParamSchema;

export const CreateWarningSchema = z.object({
  hazardZoneId: z.string().uuid("Invalid Hazard Zone ID format."),
  title: z.string().min(5, "Title is required."),
  description: z.string().min(10, "Description is required."),
  level: z.nativeEnum(WarningLevel).default(WarningLevel.MEDIUM).optional(),
  issuedBy: z.string().min(1, "Issuer name or ID is required."),
  // Date/time string in ISO 8601 format
  validUntil: z
    .string()
    .datetime("Invalid validUntil datetime format.")
    .optional(),
  isActive: z.boolean().optional().default(true),
});

export type CreateWarningDto = z.infer<typeof CreateWarningSchema>;

export const UpdateWarningSchema = CreateWarningSchema.partial();
export type UpdateWarningDto = z.infer<typeof UpdateWarningSchema>;
