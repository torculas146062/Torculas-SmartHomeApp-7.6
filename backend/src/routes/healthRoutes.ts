import { Router } from 'express';
import * as healthController from '../controllers/healthController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * `/health` gateway probe. Routing only.
 */
export const healthRouter = Router();

healthRouter.get('/', asyncHandler(healthController.getHealth));
