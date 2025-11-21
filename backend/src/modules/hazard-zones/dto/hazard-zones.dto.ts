import { z } from "zod";
import { WarningLevel } from "@prisma/client";
import { IdParamSchema } from "../../users/dto/user.dto";

// Reusing common parameter schema for path IDs
export const HazardZoneIdParamSchema = IdParamSchema;

export const CreateHazardZoneSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long."),
  type: z.string().min(3, "Type (e.g., Flood Zone) is required."),
  // Expecting GeoJSON string or similar for spatial data
  geometryData: z.string().min(10, "Geometry data is required."),
  riskLevel: z.nativeEnum(WarningLevel).default(WarningLevel.MEDIUM).optional(),
  adminNotes: z.string().optional(),
});

export type CreateHazardZoneDto = z.infer<typeof CreateHazardZoneSchema>;

export const UpdateHazardZoneSchema = CreateHazardZoneSchema.partial();
export type UpdateHazardZoneDto = z.infer<typeof UpdateHazardZoneSchema>;
