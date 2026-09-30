import { Ionicons } from '@expo/vector-icons';

/**
 * UI-facing models.
 *
 * These are decoupled from the backend wire format (see
 * `src/services/api/dto.ts`); `src/services/api/mappers.ts` converts between
 * the two so backend changes never leak into components.
 */

/**
 * Device identifiers come from the backend and may be numeric or UUID strings,
 * so the app treats them transparently.
 */
export type DeviceId = string | number;

export type Device = {
    id: DeviceId;
    name: string;
    type: string;
    icon: keyof typeof Ionicons.glyphMap;
    status: boolean;
    /** Optional room/location label, when the backend provides one. */
    room?: string;
};

export type SensorData = {
    temperature: number;
    humidity: number;
    lightLevel: number;
};
