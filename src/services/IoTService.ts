import {
    Device,
    SensorData,
    sampleDevices,
} from '../models/IoTModels';

/**
 * Simulates network communication with an IoT backend.
 *
 * Mobile App ──► IoTService ──► Simulated IoT API
 */

const FAILURE_RATE = 0.15;

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function simulateFailure(message: string) {
    if (Math.random() < FAILURE_RATE) {
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
    id: number,
    status: boolean
): Promise<Device> {

    await delay(800);

    simulateFailure('Failed to update device status');

    const device = sampleDevices.find(
        (d) => d.id === id
    );

    if (!device) {
        throw new Error(`Device ${id} not found`);
    }

    return { ...device, status };

}
