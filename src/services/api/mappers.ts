import { Device, SensorData } from '../../models/IoTModels';
import { resolveDeviceIcon } from '../../utils/deviceIcons';
import { DeviceDto, ListPayloadDto, SensorDataDto } from './dto';

/**
 * Translation layer between the backend wire format (DTOs) and the models the
 * UI consumes. Every backend response goes through here, so defensive parsing
 * stays in one place.
 */

function asNumber(value: unknown, fallback = 0): number {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : fallback;
    }

    const parsed = Number.parseFloat(String(value ?? ''));

    return Number.isFinite(parsed) ? parsed : fallback;
}

function asString(value: unknown, fallback = ''): string {
    return typeof value === 'string' && value.trim() ? value : fallback;
}

export function toDevice(dto: DeviceDto): Device {
    return {
        id: dto.id,
        name: asString(dto.name, 'Unnamed device'),
        type: asString(dto.type, 'Unknown'),
        icon: resolveDeviceIcon(dto.type),
        status: dto.status ?? dto.isOn ?? false,
        room: dto.room,
    };
}

export function toSensorData(dto: SensorDataDto): SensorData {
    return {
        temperature: asNumber(dto.temperature),
        humidity: asNumber(dto.humidity),
        lightLevel: asNumber(dto.lightLevel ?? dto.light_level),
    };
}

/**
 * Accepts both a bare array and the common `{ data | items | devices }`
 * envelopes so the client is not coupled to one serializer convention.
 */
export function unwrapList<T>(payload: ListPayloadDto<T>): T[] {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (!payload) {
        return [];
    }

    return (
        payload.data ??
        payload.items ??
        payload.devices ??
        payload.results ??
        []
    );
}
