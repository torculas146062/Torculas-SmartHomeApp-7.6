import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';
import {
    Device,
    DeviceId,
    SensorData,
} from '../models/IoTModels';
import { describeError } from '../services/api/ApiError';
import {
    checkGatewayConnection,
    getSensorData,
    getDevices,
    updateDeviceStatus,
} from '../services/IoTService';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData;
    refreshSensors: () => Promise<void>;
    isRefreshingSensors: boolean;
    sensorError: string | null;
    toggleDevice: (id: DeviceId, value: boolean) => Promise<void>;
    updatingDeviceId: DeviceId | null;
    gatewayConnected: boolean;
    isConnectingGateway: boolean;
    connectGateway: () => Promise<void>;
    disconnectGateway: () => void;
    isLoading: boolean;
    error: string | null;
    retryDevices: () => Promise<void>;
};

const IoTContext = createContext<IoTContextType | undefined>(
    undefined
);

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [devices, setDevices] = useState<Device[]>([]);

    const [gatewayConnected, setGatewayConnected] =
        useState(false);

    const [
        isConnectingGateway,
        setIsConnectingGateway,
    ] = useState(true);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState<string | null>(
        null
    );

    const [sensorError, setSensorError] = useState<
        string | null
    >(null);

    const [
        updatingDeviceId,
        setUpdatingDeviceId,
    ] = useState<DeviceId | null>(null);

    const [sensors, setSensors] = useState<SensorData>({
        temperature: 28,
        humidity: 65,
        lightLevel: 720,
    });

    const [
        isRefreshingSensors,
        setIsRefreshingSensors,
    ] = useState(false);

    const loadDevices = async () => {

        setIsLoading(true);
        setError(null);

        try {
            const data = await getDevices();
            setDevices(data);
        } catch (cause) {
            setError(
                describeError(
                    cause,
                    'Unable to retrieve devices.'
                )
            );
        } finally {
            setIsLoading(false);
        }

    };

    const refreshSensors = async () => {

        if (!gatewayConnected) {
            setSensorError(
                'IoT Gateway is disconnected.'
            );
            return;
        }

        setSensorError(null);
        setIsRefreshingSensors(true);

        try {
            const data = await getSensorData();
            setSensors(data);
        } catch (cause) {
            setSensorError(
                describeError(
                    cause,
                    'Unable to retrieve sensor data.'
                )
            );
        } finally {
            setIsRefreshingSensors(false);
        }

    };

    /**
     * Probes the gateway health endpoint and, when reachable, loads the device
     * list from the backend.
     */
    const connectGateway = async () => {

        setIsConnectingGateway(true);
        setError(null);

        try {
            const connected = await checkGatewayConnection();

            setGatewayConnected(connected);

            if (connected) {
                await loadDevices();
            } else {
                setError('IoT Gateway is unreachable.');
            }
        } catch (cause) {
            setGatewayConnected(false);
            setError(
                describeError(
                    cause,
                    'Unable to reach the IoT gateway.'
                )
            );
        } finally {
            setIsConnectingGateway(false);
        }

    };

    const disconnectGateway = () => {
        setGatewayConnected(false);
        setSensorError(null);
        setError(null);
    };

    useEffect(() => {
        connectGateway();
    }, []);

    /**
     * Retry entry point used by the error states: reconnects the gateway when
     * it is down, otherwise re-fetches the device list.
     */
    const retryDevices = async () => {

        if (!gatewayConnected) {
            await connectGateway();
            return;
        }

        await loadDevices();

    };

    const toggleDevice = async (
        id: DeviceId,
        value: boolean
    ) => {

        if (!gatewayConnected) {
            setError(
                'IoT Gateway is disconnected.'
            );
            return;
        }

        setError(null);
        setUpdatingDeviceId(id);

        const previousDevices = devices;

        // Optimistic update: reflect the change immediately and roll back if
        // the backend rejects it.
        setDevices(
            devices.map((device) =>
                device.id === id
                    ? { ...device, status: value }
                    : device
            )
        );

        try {
            const updated = await updateDeviceStatus(
                id,
                value
            );

            setDevices((current) =>
                current.map((device) =>
                    device.id === id ? updated : device
                )
            );
        } catch (cause) {
            setDevices(previousDevices);
            setError(
                describeError(
                    cause,
                    `Unable to update ${
                        devices.find((d) => d.id === id)
                            ?.name ?? 'device'
                    }.`
                )
            );
        } finally {
            setUpdatingDeviceId(null);
        }

    };

    return (
        <IoTContext.Provider
            value={{
                devices,
                sensors,
                refreshSensors,
                isRefreshingSensors,
                sensorError,
                toggleDevice,
                updatingDeviceId,
                gatewayConnected,
                isConnectingGateway,
                connectGateway,
                disconnectGateway,
                isLoading,
                error,
                retryDevices,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}

export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}