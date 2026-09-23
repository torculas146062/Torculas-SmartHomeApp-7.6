import React, {
    createContext,
    useContext,
    useState,
} from 'react';
import {
    Device,
    SensorData,
    sampleDevices,
} from '../models/IoTModels';

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

    const [deviceStatus, setDeviceStatus] = useState(
        sampleDevices.reduce((acc, device) => {
            acc[device.id] = device.status;

            return acc;
        }, {} as Record<number, boolean>)
    );

    const [gatewayConnected, setGatewayConnected] =
        useState(true);

    const [isLoading, setIsLoading] = useState(false);

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

    const refreshSensors = () => {

        if (!gatewayConnected) {
            setError('Gateway is not connected');
            return;
        }

        setError(null);
        setIsRefreshingSensors(true);

        setTimeout(() => {
            setSensors({
                temperature: Math.round(
                    20 + Math.random() * 15
                ),
                humidity: Math.round(
                    30 + Math.random() * 60
                ),
                lightLevel: Math.round(
                    100 + Math.random() * 900
                ),
            });
            setIsRefreshingSensors(false);
        }, 1000);

    };

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

    const toggleDevice = (
        id: number,
        value: boolean
    ) => {

        if (!gatewayConnected) {
            setError('Gateway is not connected');
            return;
        }

        setError(null);
        setUpdatingDeviceId(id);

        setDeviceStatus({
            ...deviceStatus,
            [id]: value,
        });

        setTimeout(() => {
            setUpdatingDeviceId(null);
        }, 600);

    };

    const updatedDevices = sampleDevices.map((device) => ({
        ...device,
        status: deviceStatus[device.id],
    }));

    return (
        <IoTContext.Provider
            value={{
                devices: updatedDevices,
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