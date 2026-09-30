import { environment } from '../../config/environment';
import {
    Device,
    DeviceId,
    SensorData,
} from '../../models/IoTModels';

/**
 * In-memory simulation of the IoT backend.
 *
 * This is the only place that fabricates data. It is used when
 * `EXPO_PUBLIC_USE_MOCK_API` is `true` (the default) so the UI can be developed
 * before the real backend is reachable. Keep the behaviour in sync with the
 * contract documented in `docs/backend-integration.md`.
 */

export const sampleDevices: Device[] = [
    {
        id: 1,
        name: 'Living Room Light',
        type: 'Smart Light',
        icon: 'bulb-outline',
        status: true,
    },
    {
        id: 2,
        name: 'Bedroom Fan',
        type: 'Smart Fan',
        icon: 'sync-outline',
        status: false,
    },
    {
        id: 3,
        name: 'Front Door Lock',
        type: 'Smart Lock',
        icon: 'lock-closed-outline',
        status: true,
    },
];

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function simulateFailure(message: string): void {
    if (Math.random() < environment.mockFailureRate) {
        throw new Error(message);
    }
}

export async function getSensorData(): Promise<SensorData> {
    await delay(1500);

    simulateFailure('Failed to fetch sensor data');

    return {
        temperature: Math.round(20 + Math.random() * 15),
        humidity: Math.round(30 + Math.random() * 60),
        lightLevel: Math.round(100 + Math.random() * 900),
    };
}

export async function getDevices(): Promise<Device[]> {
    await delay(1000);

    simulateFailure('Failed to fetch devices');

    return sampleDevices.map((device) => ({ ...device }));
}

export async function updateDeviceStatus(
    id: DeviceId,
    status: boolean
): Promise<Device> {
    await delay(800);

    simulateFailure('Failed to update device status');

    const device = sampleDevices.find((d) => d.id === id);

    if (!device) {
        throw new Error(`Device ${id} not found`);
    }

    return { ...device, status };
}

export async function checkGatewayConnection(): Promise<boolean> {
    await delay(800);

    return true;
}
