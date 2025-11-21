import { Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as UserService from "./users.service";
import {
  getPaginationParams,
  createPaginationMeta,
} from "../../utils/pagination";
import { UpdateMeDto, UpdateRoleDto } from "./dto/user.dto";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

/**
 * GET /users/me
 * Retrieves the profile of the authenticated user.
 */
export const getMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const user = await UserService.getUserById(userId);

    res.status(200).json({
      status: "success",
      data: user,
    });
  }
);

/**
 * PUT /users/me
 * Updates the profile of the authenticated user.
 */
export const updateMe = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const dto = req.body as UpdateMeDto;
    const user = await UserService.updateMe(userId, dto);

    res.status(200).json({
      status: "success",
      message: "Profile updated successfully.",
      data: user,
    });
  }
);

/**
 * GET /users
 * Retrieves a paginated list of all users (Admin/Super Admin only).
 */
export const getUsers = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { users, totalCount } = await UserService.getAllUsers(req);
    const params = getPaginationParams(req);
    const meta = createPaginationMeta(totalCount, params);

    res.status(200).json({
      status: "success",
      data: users,
      meta,
    });
  }
);

/**
 * PUT /users/:id/role
 * Updates a user's role (Super Admin only).
 */
export const updateRole = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const targetId = req.params.id;
    const dto = req.body as UpdateRoleDto;

    const user = await UserService.updateRole(targetId, dto);

    res.status(200).json({
      status: "success",
      message: `User ${user.email} role updated to ${user.role}.`,
      data: user,
    });
  }
);

/**
 * DELETE /users/:id
 * Deletes a user (Super Admin only).
 */
export const deleteUser = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const targetId = req.params.id;
    await UserService.deleteUser(targetId);

    res.status(204).json({
      status: "success",
      message: "User deleted successfully.",
    });
  }
);
