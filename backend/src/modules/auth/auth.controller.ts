import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as AuthService from "./auth.service";
import { RegisterDto, LoginDto, RefreshTokenDto } from "./dto/auth.dto";

/**
 * POST /auth/register
 */
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as RegisterDto;
    const result = await AuthService.register(dto);

    // Remove password hash before sending
    const { passwordHash, ...user } = result.user;

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: {
        user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  }
);

/**
 * POST /auth/login
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as LoginDto;
    const result = await AuthService.login(dto);

    // Remove password hash before sending
    const { passwordHash, ...user } = result.user;

    res.status(200).json({
      status: "success",
      message: "Login successful.",
      data: {
        user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  }
);

/**
 * POST /auth/refresh-token
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as RefreshTokenDto;
    const result = await AuthService.refreshAccessToken(dto.refreshToken);

    res.status(200).json({
      status: "success",
      message: "New access token generated.",
      data: result,
    });
  }
);
