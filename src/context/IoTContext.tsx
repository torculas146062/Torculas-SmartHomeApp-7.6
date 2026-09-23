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

    const toggleDevice = (
        id: number,
        value: boolean
    ) => {

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