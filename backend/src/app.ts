import cors from 'cors';
import express, { type Express } from 'express';
import { env } from './config/env.js';
import {
    errorHandler,
    notFoundHandler,
} from './middleware/errorHandler.js';
import { deviceRouter } from './routes/deviceRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';
import { sensorRouter } from './routes/sensorRoutes.js';

/**
 * Resolves `CORS_ORIGIN` into a value the `cors` middleware understands:
 * `*` allows any origin, otherwise a comma-separated list is split.
 */
function resolveCorsOrigin(value: string): string | string[] {
    const trimmed = value.trim();

    if (!trimmed || trimmed === '*') {
        return '*';
    }

    return trimmed
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
}

/** Builds the Express application without binding a port (keeps it testable). */
export function createApp(): Express {
    const app = express();

    app.disable('x-powered-by');

    app.use(cors({ origin: resolveCorsOrigin(env.corsOrigin) }));
    app.use(express.json({ limit: '64kb' }));

    app.use('/health', healthRouter);
    app.use('/api/devices', deviceRouter);
    app.use('/api/sensors', sensorRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
