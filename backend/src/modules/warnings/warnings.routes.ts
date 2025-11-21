import { Router } from "express";
import { roleGuard } from "../../middleware/roleGuard";
import validate from "../../middleware/validate";
import { ROLES } from "../../config/constants";
import * as WarningController from "./warnings.controller";
import { authenticate } from "../../middleware/authMiddleware";
import {
  CreateWarningSchema,
  UpdateWarningSchema,
  WarningIdParamSchema,
} from "./dto/warnings.dto";

const router = Router();

// Middleware for CUD operations (requires authentication)
router.use(authenticate);

// POST /warnings (Admin/Super Admin)
router.post(
  "/",
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  validate({ body: CreateWarningSchema }),
  WarningController.createWarning
);

// GET /warnings (Public read access)
router.get("/", WarningController.getWarnings);

// GET /warnings/:id (Public read access)
router.get(
  "/:id",
  validate({ params: WarningIdParamSchema }),
  WarningController.getWarning
);

// PUT /warnings/:id (Admin/Super Admin)
router.put(
  "/:id",
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  validate({ params: WarningIdParamSchema, body: UpdateWarningSchema }),
  WarningController.updateWarning
);

// DELETE /warnings/:id (Admin/Super Admin)
router.delete(
  "/:id",
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN]),
  validate({ params: WarningIdParamSchema }),
  WarningController.deleteWarning
);

export default router;
