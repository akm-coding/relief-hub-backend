import { Request } from "express";
import {
  CreateHazardZoneDto,
  UpdateHazardZoneDto,
} from "./dto/hazard-zones.dto";
import { prisma } from "../../config/prisma";
import { getPaginationParams } from "../../utils/pagination";
import { NotFoundError } from "../../utils/httpErrors";

/**
 * Creates a new hazard zone.
 */
export const createHazardZone = async (dto: CreateHazardZoneDto) => {
  return prisma.hazardZone.create({
    data: {
      ...dto,
      riskLevel: dto.riskLevel || "MEDIUM",
    },
  });
};

/**
 * Retrieves a paginated list of all hazard zones.
 */
export const getAllHazardZones = async (req: Request) => {
  const { skip, take } = getPaginationParams(req);

  const [zones, totalCount] = await prisma.$transaction([
    prisma.hazardZone.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.hazardZone.count(),
  ]);

  return { zones, totalCount };
};

/**
 * Retrieves a single hazard zone by ID.
 */
export const getHazardZoneById = async (id: string) => {
  const zone = await prisma.hazardZone.findUnique({
    where: { id },
  });
  if (!zone) {
    throw new NotFoundError("Hazard Zone not found.");
  }
  return zone;
};

/**
 * Updates an existing hazard zone.
 */
export const updateHazardZone = async (
  id: string,
  dto: UpdateHazardZoneDto
) => {
  try {
    const updatedZone = await prisma.hazardZone.update({
      where: { id },
      data: dto,
    });
    return updatedZone;
  } catch (error) {
    // P2025 is Prisma's error code for "record to update/delete was not found"
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Hazard Zone not found.");
    }
    throw error;
  }
};

/**
 * Deletes a hazard zone by ID.
 */
export const deleteHazardZone = async (id: string) => {
  try {
    await prisma.hazardZone.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Hazard Zone not found.");
    }
    throw error;
  }
};
