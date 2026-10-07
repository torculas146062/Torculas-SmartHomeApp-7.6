import { Router } from 'express';
import * as sensorController from '../controllers/sensorController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * `/api/sensors` routes. Routing only — SQL lives in the repository layer.
 */
export const sensorRouter = Router();

sensorRouter.get(
    '/latest',
    asyncHandler(sensorController.getLatestSensors)
);

sensorRouter.post(
    '/readings',
    asyncHandler(sensorController.createSensorReading)
);
