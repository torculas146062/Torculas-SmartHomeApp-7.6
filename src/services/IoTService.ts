import { endpoints, environment } from '../config/environment';
import {
    Device,
    DeviceId,
    SensorData,
} from '../models/IoTModels';
import { ApiError } from './api/ApiError';
import { DeviceDto, HealthDto, SensorDataDto } from './api/dto';
import { httpClient } from './api/httpClient';
import { toDevice, toSensorData, unwrapList } from './api/mappers';
import * as mock from './mock/IoTMockService';

/**
 * IoT data access layer.
 *
 * ```
 * Screens ──► IoTContext ──► IoTService ──► httpClient ──► IoT backend
 *                                    └────► IoTMockService (EXPO_PUBLIC_USE_MOCK_API)
 * ```
 *
 * Every function returns app models, never DTOs, and throws `ApiError` on
 * failure. Swapping between the simulation and the real backend only requires
 * changing `.env` — no code changes.
 */

export async function getSensorData(): Promise<SensorData> {
    if (environment.useMockApi) {
        return mock.getSensorData();
    }

    const dto = await httpClient.get<SensorDataDto>(
        endpoints.latestSensors
    );

    return toSensorData(dto);
}

export async function getDevices(): Promise<Device[]> {
    if (environment.useMockApi) {
        return mock.getDevices();
    }

    const payload = await httpClient.get<DeviceDto[]>(
        endpoints.devices
    );

    return unwrapList<DeviceDto>(payload).map(toDevice);
}

export async function updateDeviceStatus(
    id: DeviceId,
    status: boolean
): Promise<Device> {
    if (environment.useMockApi) {
        return mock.updateDeviceStatus(id, status);
    }

    const dto = await httpClient.patch<DeviceDto>(
        endpoints.device(id),
        { status }
    );

    return toDevice(dto);
}

/**
 * Probes the gateway and reports whether it is reachable, without surfacing a
 * transport failure to the caller (a down gateway is an expected state).
 */
export async function checkGatewayConnection(): Promise<boolean> {
    if (environment.useMockApi) {
        return mock.checkGatewayConnection();
    }

    try {
        const health = await httpClient.get<HealthDto>(
            endpoints.health,
            { timeoutMs: environment.healthCheckTimeoutMs }
        );

        return health?.connected ?? true;
    } catch (cause) {
        if (cause instanceof ApiError) {
            return false;
        }

        throw cause;
    }
}

/**
 * Re-exported from the HTTP client so the future auth flow can attach the
 * backend bearer token without reaching into `src/services/api` directly.
 */
export { setAuthToken } from './api/httpClient';
export { ApiError } from './api/ApiError';
