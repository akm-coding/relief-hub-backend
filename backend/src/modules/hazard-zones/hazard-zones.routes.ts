import { Router } from "express";
import { roleGuard } from "../../middleware/roleGuard";
import { ROLES } from "../../config/constants";
import { authenticate } from "../../middleware/authMiddleware";

const router = Router();

// Routes requiring Admin/Super Admin for CUD operations
router.use(authenticate);

// POST /hazard-zones (Admin/Super Admin)
router.post(
  "/",
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN])
  // Controller.createHazardZone
);

// GET /hazard-zones (Public read access)
router.get(
  "/"
  // Public read access - no role guard needed
  // Controller.getHazardZones
);

// GET /hazard-zones/:id (Public read access)
router.get(
  "/:id"
  // Public read access - no role guard needed
  // Controller.getHazardZone
);

// PUT /hazard-zones/:id (Admin/Super Admin)
router.put(
  "/:id",
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN])
  // Controller.updateHazardZone
);

// DELETE /hazard-zones/:id (Admin/Super Admin)
router.delete(
  "/:id",
  roleGuard([ROLES.ADMIN, ROLES.SUPER_ADMIN])
  // Controller.deleteHazardZone
);

export default router;
