import * as deviceRepository from '../repositories/deviceRepository.js';
import type { DeviceDto } from '../types/api.js';
import type { DeviceRow } from '../types/database.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * Device business logic. Turns repository rows into API DTOs and owns the
 * "device does not exist" rule, so controllers stay thin and HTTP-only.
 */

export function toDeviceDto(row: DeviceRow): DeviceDto {
    const dto: DeviceDto = {
        id: row.id,
        name: row.name,
        type: row.type,
        status: row.status === 1,
    };

    if (row.room) {
        dto.room = row.room;
    }

    return dto;
}

export async function listDevices(): Promise<DeviceDto[]> {
    const rows = await deviceRepository.findAll();

    return rows.map(toDeviceDto);
}

export async function getDevice(id: number): Promise<DeviceDto> {
    const row = await deviceRepository.findById(id);

    if (!row) {
        throw HttpError.notFound(`Device ${id} was not found.`);
    }

    return toDeviceDto(row);
}

export async function setDeviceStatus(
    id: number,
    status: boolean
): Promise<DeviceDto> {
    const row = await deviceRepository.updateStatus(id, status);

    if (!row) {
        throw HttpError.notFound(`Device ${id} was not found.`);
    }

    return toDeviceDto(row);
}
