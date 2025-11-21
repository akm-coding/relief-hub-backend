import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  CreateHazardZoneDto,
  UpdateHazardZoneDto,
} from "./dto/hazard-zones.dto";
import * as HazardZoneService from "./hazard-zones.service";
import {
  createPaginationMeta,
  getPaginationParams,
} from "../../utils/pagination";

/**
 * POST /hazard-zones
 */
export const createHazardZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const dto = req.body as CreateHazardZoneDto;
    const zone = await HazardZoneService.createHazardZone(dto);
    res.status(201).json({
      status: "success",
      message: "Hazard zone created successfully.",
      data: zone,
    });
  }
);

/**
 * GET /hazard-zones
 */
export const getHazardZones = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { zones, totalCount } = await HazardZoneService.getAllHazardZones(
      req
    );
    const params = getPaginationParams(req);
    const meta = createPaginationMeta(totalCount, params);

    res.status(200).json({
      status: "success",
      data: zones,
      meta,
    });
  }
);

/**
 * GET /hazard-zones/:id
 */
export const getHazardZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const zone = await HazardZoneService.getHazardZoneById(id);
    res.status(200).json({
      status: "success",
      data: zone,
    });
  }
);

/**
 * PUT /hazard-zones/:id
 */
export const updateHazardZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const dto = req.body as UpdateHazardZoneDto;
    const zone = await HazardZoneService.updateHazardZone(id, dto);
    res.status(200).json({
      status: "success",
      message: "Hazard zone updated successfully.",
      data: zone,
    });
  }
);

/**
 * DELETE /hazard-zones/:id
 */
export const deleteHazardZone = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await HazardZoneService.deleteHazardZone(id);
    res.status(204).send(); // No Content on successful deletion
  }
);
