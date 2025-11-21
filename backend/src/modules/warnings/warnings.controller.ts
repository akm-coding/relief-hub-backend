import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as WarningService from "./warnings.service";
import { CreateWarningDto, UpdateWarningDto } from "./dto/warnings.dto";
import {
  createPaginationMeta,
  getPaginationParams,
} from "../../utils/pagination";

/**
 * POST /warnings
 */
export const createWarning = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as CreateWarningDto;
    const warning = await WarningService.createWarning(dto);
    res.status(201).json({
      status: "success",
      message: "Warning created successfully.",
      data: warning,
    });
  }
);

/**
 * GET /warnings
 */
export const getWarnings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { warnings, totalCount } = await WarningService.getAllWarnings(req);
    const params = getPaginationParams(req);
    const meta = createPaginationMeta(totalCount, params);

    res.status(200).json({
      status: "success",
      data: warnings,
      meta,
    });
  }
);

/**
 * GET /warnings/:id
 */
export const getWarning = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const warning = await WarningService.getWarningById(id);
    res.status(200).json({
      status: "success",
      data: warning,
    });
  }
);

/**
 * PUT /warnings/:id
 */
export const updateWarning = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const dto = req.body as UpdateWarningDto;
    const warning = await WarningService.updateWarning(id, dto);
    res.status(200).json({
      status: "success",
      message: "Warning updated successfully.",
      data: warning,
    });
  }
);

/**
 * DELETE /warnings/:id
 */
export const deleteWarning = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await WarningService.deleteWarning(id);
    res.status(204).send(); // No Content on successful deletion
  }
);
