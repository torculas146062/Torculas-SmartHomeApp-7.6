import type { RowDataPacket } from 'mysql2';

/**
 * Raw table shapes as returned by MySQL.
 *
 * These stay internal to the repository layer; the service layer converts them
 * into the API DTOs in `src/types/api.ts` before anything reaches a controller.
 */

export interface DeviceRow extends RowDataPacket {
    id: number;
    name: string;
    type: string;
    status: number;
    room: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface SensorReadingRow extends RowDataPacket {
    id: number;
    temperature: number;
    humidity: number;
    light_level: number;
    recorded_at: Date;
}
