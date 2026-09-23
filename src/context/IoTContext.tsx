import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';
import {
    Device,
    SensorData,
} from '../models/IoTModels';
import {
    getSensorData,
    getDevices,
    updateDeviceStatus,
} from '../services/IoTService';

type IoTContextType = {
    devices: Device[];
    sensors: SensorData;
    refreshSensors: () => void;
    isRefreshingSensors: boolean;
    toggleDevice: (id: number, value: boolean) => void;
    updatingDeviceId: number | null;
    gatewayConnected: boolean;
    connectGateway: () => void;
    disconnectGateway: () => void;
    isLoading: boolean;
    error: string | null;
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
        useState(true);

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(
        null
    );

    const [
        updatingDeviceId,
        setUpdatingDeviceId,
    ] = useState<number | null>(null);

    const [sensors, setSensors] = useState<SensorData>({
        temperature: 28,
        humidity: 65,
        lightLevel: 720,
    });

    const [
        isRefreshingSensors,
        setIsRefreshingSensors,
    ] = useState(false);

    const refreshSensors = async () => {

        if (!gatewayConnected) {
            setError('Gateway is not connected');
            return;
        }

        setError(null);
        setIsRefreshingSensors(true);

        try {
            const data = await getSensorData();
            setSensors(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to refresh sensors'
            );
        } finally {
            setIsRefreshingSensors(false);
        }

    };

    const loadDevices = async () => {

        setIsLoading(true);
        setError(null);

        try {
            const data = await getDevices();
            setDevices(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to load devices'
            );
        } finally {
            setIsLoading(false);
        }

    };

    useEffect(() => {
        loadDevices();
    }, []);

    const connectGateway = () => {

        setIsLoading(true);
        setError(null);

        setTimeout(() => {
            setGatewayConnected(true);
            setIsLoading(false);
        }, 800);

    };

    const disconnectGateway = () => {
        setGatewayConnected(false);
    };

    const toggleDevice = async (
        id: number,
        value: boolean
    ) => {

        if (!gatewayConnected) {
            setError('Gateway is not connected');
            return;
        }

        setError(null);
        setUpdatingDeviceId(id);

        const previousDevices = devices;

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
        } catch (err) {
            setDevices(previousDevices);
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to update device'
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
                toggleDevice,
                updatingDeviceId,
                gatewayConnected,
                connectGateway,
                disconnectGateway,
                isLoading,
                error,
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