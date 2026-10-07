import { Router } from 'express';
import * as deviceController from '../controllers/deviceController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * `/api/devices` routes.
 *
 * Routing only — no SQL and no business rules live here.
 */
export const deviceRouter = Router();

deviceRouter.get('/', asyncHandler(deviceController.listDevices));

deviceRouter.get('/:id', asyncHandler(deviceController.getDevice));

deviceRouter.patch('/:id', asyncHandler(deviceController.patchDeviceStatus));
