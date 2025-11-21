import { Router } from "express";
import * as UserController from "./users.controller";
import { roleGuard } from "../../middleware/roleGuard";
import { ROLES } from "../../config/constants";
import validate from "../../middleware/validate";
import {
  IdParamSchema,
  UpdateMeSchema,
  UpdateRoleSchema,
} from "./dto/user.dto";
import { authenticate } from "../../middleware/authMiddleware";

const router = Router();

// Middleware for all /users routes (requires authentication)
router.use(authenticate);

// GET /users/me - Get profile (citizen, volunteer, responder, admin)
router.get("/me", UserController.getMe);

// PUT /users/me - Update profile (citizen, volunteer, responder, admin)
router.put("/me", validate({ body: UpdateMeSchema }), UserController.updateMe);

// --- Admin/Super Admin Routes ---

// GET /users - Get all users (Admin/Super Admin)
router.get(
  "/",
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  UserController.getUsers
);

// PUT /users/:id/role - Update user role (Super Admin only)
router.put(
  "/:id/role",
  roleGuard([ROLES.SUPER_ADMIN]),
  validate({ params: IdParamSchema, body: UpdateRoleSchema }),
  UserController.updateRole
);

// DELETE /users/:id - Delete user (Super Admin only)
router.delete(
  "/:id",
  roleGuard([ROLES.SUPER_ADMIN]),
  validate({ params: IdParamSchema }),
  UserController.deleteUser
);

export default router;
