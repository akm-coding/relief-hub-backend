import { Request } from "express";
import { CreateWarningDto, UpdateWarningDto } from "./dto/warnings.dto";
import { prisma } from "../../config/prisma";
import { getPaginationParams } from "../../utils/pagination";
import { NotFoundError } from "../../utils/httpErrors";

/**
 * Creates a new warning.
 */
export const createWarning = async (dto: CreateWarningDto) => {
  return prisma.warning.create({
    data: {
      ...dto,
      // Convert ISO string to Date object
      validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
    },
  });
};

/**
 * Retrieves a paginated list of all warnings.
 */
export const getAllWarnings = async (req: Request) => {
  const { skip, take } = getPaginationParams(req);

  const [warnings, totalCount] = await prisma.$transaction([
    prisma.warning.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: { hazardZone: { select: { name: true, type: true } } },
    }),
    prisma.warning.count(),
  ]);

  return { warnings, totalCount };
};

/**
 * Retrieves a single warning by ID.
 */
export const getWarningById = async (id: string) => {
  const warning = await prisma.warning.findUnique({
    where: { id },
    include: { hazardZone: true },
  });
  if (!warning) {
    throw new NotFoundError("Warning not found.");
  }
  return warning;
};

/**
 * Updates an existing warning.
 */
export const updateWarning = async (id: string, dto: UpdateWarningDto) => {
  try {
    const updatedWarning = await prisma.warning.update({
      where: { id },
      data: {
        ...dto,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
      },
    });
    return updatedWarning;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Warning not found or invalid Hazard Zone ID.");
    }
    throw error;
  }
};

/**
 * Deletes a warning by ID.
 */
export const deleteWarning = async (id: string) => {
  try {
    await prisma.warning.delete({
      where: { id },
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2025") {
      throw new NotFoundError("Warning not found.");
    }
    throw error;
  }
};
