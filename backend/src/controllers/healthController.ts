import type { Request, Response } from 'express';
import { checkDatabaseConnection } from '../db/pool.js';
import type { HealthDto } from '../types/api.js';

/**
 * Gateway probe consumed by the app on start-up and by the Settings
 * "Reconnect" action.
 *
 * `connected` is always `true` when the server answers: the app uses it to mean
 * "the IoT backend is reachable". MySQL reachability is reported separately in
 * `database` so a down database is distinguishable from a down gateway.
 */
export async function getHealth(
    _req: Request,
    res: Response
): Promise<void> {
    const database = (await checkDatabaseConnection()) ? 'up' : 'down';

    const payload: HealthDto = {
        status: 'ok',
        connected: true,
        database,
        timestamp: new Date().toISOString(),
    };

    res.json(payload);
}
