import { RegisterDto, LoginDto } from "./dto/auth.dto";
import { BadRequestError, UnauthorizedError } from "../../utils/httpErrors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  SALT_ROUNDS,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} from "../../config/constants";
import { UserRole } from "@prisma/client";
import { prisma } from "../../config/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generates an Access Token and a Refresh Token for a user.
 * @param userId The ID of the user.
 * @param userRole The role of the user.
 * @returns TokenPair (accessToken and refreshToken)
 */
const generateTokens = (userId: string, userRole: UserRole): TokenPair => {
  const accessToken = jwt.sign({ userId, role: userRole }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

/**
 * Handles user registration.
 */
export const register = async (dto: RegisterDto) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: dto.email },
  });

  if (existingUser) {
    throw new BadRequestError("User with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const newUser = await prisma.user.create({
    data: {
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role || UserRole.citizen,
    },
  });

  // Generate tokens for immediate login
  const tokens = generateTokens(newUser.id, newUser.role);

  // Create a corresponding Responder profile if the role is 'responder'
  if (newUser.role === UserRole.responder) {
    await prisma.responder.create({ data: { userId: newUser.id } });
  }

  return { user: newUser, ...tokens };
};

/**
 * Handles user login.
 */
export const login = async (dto: LoginDto) => {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });

  if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
    throw new UnauthorizedError("Invalid credentials.");
  }

  if (!user.isActive) {
    throw new UnauthorizedError("Your account has been deactivated.");
  }

  const tokens = generateTokens(user.id, user.role);

  return { user, ...tokens };
};

/**
 * Generates a new access token using a valid refresh token.
 */
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload;
    const userId = decoded.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user || !user.role) {
      throw new UnauthorizedError("Invalid user in refresh token.");
    }

    // Generate a new access token (the refresh token remains the same)
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );

    return { accessToken };
  } catch (error) {
    // Handle token errors specifically
    throw new UnauthorizedError("Invalid or expired refresh token.");
  }
};
