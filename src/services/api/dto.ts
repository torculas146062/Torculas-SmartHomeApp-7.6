/**
 * Wire format (Data Transfer Objects) of the IoT backend.
 *
 * These types describe what the server sends, which is deliberately kept
 * separate from the UI-facing models in `src/models/IoTModels.ts`. Optional
 * aliases are declared so the mappers can tolerate the common naming
 * variations without a client rewrite.
 */

/** Device as returned by `GET /api/devices`. */
export type DeviceDto = {
    id: string | number;
    name: string;
    type: string;
    /** Preferred boolean flag. */
    status?: boolean;
    /** Alias used by some backends. */
    isOn?: boolean;
    /** Optional room/location label. */
    room?: string;
};

/** Sensor snapshot as returned by `GET /api/sensors/latest`. */
export type SensorDataDto = {
    temperature: number;
    humidity: number;
    /** camelCase variant. */
    lightLevel?: number;
    /** snake_case variant. */
    light_level?: number;
};

/** Response of `GET /health`, used as a gateway connectivity probe. */
export type HealthDto = {
    status?: string;
    connected?: boolean;
};

/** Envelope shapes a list endpoint may respond with. */
export type ListPayloadDto<T> =
    | T[]
    | {
          data?: T[];
          items?: T[];
          devices?: T[];
          results?: T[];
      };
