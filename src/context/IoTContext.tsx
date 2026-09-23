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
    toggleDevice: (id: number, value: boolean) => void;
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

        setDeviceStatus({
            ...deviceStatus,
            [id]: value,
        });

    };

    const updatedDevices = sampleDevices.map((device) => ({
        ...device,
        status: deviceStatus[device.id],
    }));

    const sensors: SensorData = {
        temperature: 100,
        humidity: 99,
        lightLevel: 1000,
    };

    return (
        <IoTContext.Provider
            value={{
                devices: updatedDevices,
                sensors,
                toggleDevice,
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