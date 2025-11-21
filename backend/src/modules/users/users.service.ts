import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../../utils/httpErrors";
import { UpdateMeDto, UpdateRoleDto } from "./dto/user.dto";
import { getPaginationParams } from "../../utils/pagination";
import { Request } from "express";
import { UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";

/**
 * Retrieves a user by their ID.
 * @param userId The ID of the user to retrieve.
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
      isActive: true,
      isVerified: true,
      createdAt: true,
      responderProfile: { select: { isAvailable: true, specialty: true } }, // Include responder info if available
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }
  return user;
};

/**
 * Updates the current authenticated user's profile.
 * @param userId The ID of the authenticated user.
 * @param dto The update data.
 */
export const updateMe = async (userId: string, dto: UpdateMeDto) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dto,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      role: true,
    },
  });
  return updatedUser;
};

/**
 * Retrieves a paginated list of all users.
 * @param req The Express request object.
 */
export const getAllUsers = async (req: Request) => {
  const { skip, take } = getPaginationParams(req);

  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    }),
    prisma.user.count(),
  ]);

  return { users, totalCount };
};

/**
 * Updates a specific user's role.
 * @param targetId The ID of the user whose role is being updated.
 * @param dto The new role.
 */
export const updateRole = async (targetId: string, dto: UpdateRoleDto) => {
  if (targetId === process.env.SUPER_ADMIN_ID) {
    // assuming super_admin_id is set up via seed
    throw new ForbiddenError("Cannot change the role of the Super Admin.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetId },
    data: { role: dto.role },
    select: { id: true, email: true, role: true, firstName: true },
  });

  // Create or delete Responder profile if the role changes to/from 'responder'
  if (updatedUser.role === UserRole.responder) {
    await prisma.responder.upsert({
      where: { userId: targetId },
      update: {},
      create: { userId: targetId },
    });
  } else {
    await prisma.responder
      .delete({ where: { userId: targetId } })
      .catch(() => {}); // ignore if it doesn't exist
  }

  return updatedUser;
};

/**
 * Deletes a user.
 * @param targetId The ID of the user to delete.
 */
export const deleteUser = async (targetId: string) => {
  if (targetId === process.env.SUPER_ADMIN_ID) {
    throw new ForbiddenError("Cannot delete the Super Admin account.");
  }

  const deletedUser = await prisma.user.delete({
    where: { id: targetId },
    select: { id: true, email: true },
  });
  return deletedUser;
};
