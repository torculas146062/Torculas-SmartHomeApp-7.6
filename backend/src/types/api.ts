/**
 * JSON shapes returned to the mobile app.
 *
 * They intentionally match the contract documented in
 * `docs/backend-integration.md` and parsed by `src/services/api/dto.ts`, so the
 * app can talk to this backend with `EXPO_PUBLIC_USE_MOCK_API=false`.
 */

export interface DeviceDto {
    id: number;
    name: string;
    type: string;
    /** Boolean power state (stored as TINYINT(1) in MySQL). */
    status: boolean;
    /** Optional room/location label. */
    room?: string;
}

export interface SensorDataDto {
    temperature: number;
    humidity: number;
    lightLevel: number;
    /** ISO-8601 timestamp of the reading, when known. */
    recordedAt?: string;
}

export interface HealthDto {
    status: 'ok';
    connected: true;
    database: 'up' | 'down';
    timestamp: string;
}
