import type { Request, Response } from 'express';
import * as sensorService from '../services/sensorService.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * HTTP layer for `/api/sensors`. All SQL is delegated to `sensorService` →
 * `sensorRepository`.
 */

function parseNumber(value: unknown, field: string): number {
    const parsed =
        typeof value === 'number'
            ? value
            : Number.parseFloat(String(value ?? ''));

    if (!Number.isFinite(parsed)) {
        throw HttpError.badRequest(`"${field}" must be a finite number.`);
    }

    return parsed;
}

export async function getLatestSensors(
    _req: Request,
    res: Response
): Promise<void> {
    const reading = await sensorService.getLatestSensorData();

    res.json(reading);
}

export async function createSensorReading(
    req: Request,
    res: Response
): Promise<void> {
    const body = (req.body ?? {}) as Record<string, unknown>;

    const temperature = parseNumber(body.temperature, 'temperature');
    const humidity = parseNumber(body.humidity, 'humidity');
    const lightLevel = parseNumber(
        body.lightLevel ?? body.light_level,
        'lightLevel'
    );

    const reading = await sensorService.recordSensorData({
        temperature,
        humidity,
        lightLevel,
    });

    res.status(201).json(reading);
}
