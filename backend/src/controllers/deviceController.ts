import type { Request, Response } from 'express';
import * as deviceService from '../services/deviceService.js';
import { HttpError } from '../utils/HttpError.js';

/**
 * HTTP layer for `/api/devices`. Handles request parsing and status codes only;
 * all data access happens in `deviceService` / `deviceRepository`.
 */

function parseDeviceId(raw: unknown): number {
    const serialised = Array.isArray(raw) ? raw[0] : raw;
    const id = Number.parseInt(String(serialised ?? ''), 10);

    if (!Number.isInteger(id) || id <= 0) {
        throw HttpError.badRequest(
            `"${String(serialised ?? '')}" is not a valid device id.`
        );
    }

    return id;
}

export async function listDevices(
    _req: Request,
    res: Response
): Promise<void> {
    const devices = await deviceService.listDevices();

    res.json(devices);
}

export async function getDevice(
    req: Request,
    res: Response
): Promise<void> {
    const device = await deviceService.getDevice(
        parseDeviceId(req.params.id)
    );

    res.json(device);
}

export async function patchDeviceStatus(
    req: Request,
    res: Response
): Promise<void> {
    const id = parseDeviceId(req.params.id);
    const body = (req.body ?? {}) as { status?: unknown };

    if (typeof body.status !== 'boolean') {
        throw HttpError.badRequest(
            'Request body must include a boolean "status" field.'
        );
    }

    const device = await deviceService.setDeviceStatus(id, body.status);

    res.json(device);
}
