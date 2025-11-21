import { Router } from "express";
import * as AuthController from "./auth.controller";
import validate from "../../middleware/validate";
import {
  LoginSchema,
  RegisterSchema,
  RefreshTokenSchema,
} from "./dto/auth.dto";

const router = Router();

// POST /auth/register
router.post(
  "/register",
  validate({ body: RegisterSchema }),
  AuthController.register
);

// POST /auth/login
router.post("/login", validate({ body: LoginSchema }), AuthController.login);

// POST /auth/refresh-token
router.post(
  "/refresh-token",
  validate({ body: RefreshTokenSchema }),
  AuthController.refreshToken
);

export default router;
