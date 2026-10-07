import * as sensorRepository from '../repositories/sensorRepository.js';
import type { SensorDataDto } from '../types/api.js';
import type { SensorReadingRow } from '../types/database.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Sensor business logic: converts stored readings into the API DTO the app
 * expects and enforces the "no readings yet" rule.
 */

export function toSensorDataDto(row: SensorReadingRow): SensorDataDto {
    return {
        temperature: Number(row.temperature),
        humidity: Number(row.humidity),
        lightLevel: Number(row.light_level),
        recordedAt: new Date(row.recorded_at).toISOString(),
    };
}

export async function getLatestSensorData(): Promise<SensorDataDto> {
    const row = await sensorRepository.findLatest();

    if (!row) {
        throw HttpError.notFound('No sensor readings have been recorded yet.');
    }

    return toSensorDataDto(row);
}

export async function recordSensorData(
    reading: sensorRepository.NewSensorReading
): Promise<SensorDataDto> {
    const row = await sensorRepository.insert(reading);

    if (!row) {
        throw HttpError.internal('The sensor reading could not be stored.');
    }

    return toSensorDataDto(row);
}
