import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';



export default function DashboardScreen() {
    // const [deviceStatus, setDeviceStatus] = useState(
    //     devices.reduce((acc, device) => {
    //         acc[device.id] = device.status;
    //         return acc;
    //     }, {} as Record<number, boolean>)
    // );

    const { devices, 
        sensors, 
        toggleDevice,
        updatingDeviceId,
        gatewayConnected,
        isLoading,
        error,
        retryDevices } = useIoT();

    return (
        <View style={styles.container}>

            <Text style={styles.greeting}>
                Good evening
            </Text>

            <Text style={styles.title}>
                IoT Dashboard
            </Text>

            {!gatewayConnected && (
                <Text style={styles.gatewayBanner}>
                    IoT Gateway is disconnected.
                </Text>
            )}

            <View style={styles.sensorRow}>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Temperature
                        </Text>
                    </View>

                    <Text style={styles.sensorValue}>
                        {sensors.temperature}°C
                    </Text>
                </View>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                        />

                        <Text style={styles.sensorLabel}>
                            Humidity
                        </Text>
                    </View>

                    <Text style={styles.sensorValue}>
                        {sensors.humidity}%
                    </Text>
                </View>

            </View>

            <Text style={styles.sectionTitle}>
                Device Status
            </Text>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" />

                    <Text style={styles.loadingText}>
                        Loading devices...
                    </Text>
                </View>
            )}

            {!isLoading && devices.length === 0 && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {error ?? 'No devices found'}
                    </Text>

                    {error && (
                        <Pressable
                            style={({ pressed }) => [
                                styles.retryButton,
                                pressed &&
                                    styles.retryButtonPressed,
                            ]}
                            onPress={retryDevices}
                            android_ripple={{
                                color: '#ffffff55',
                            }}
                        >
                            <Text
                                style={
                                    styles.retryButtonText
                                }
                            >
                                Retry
                            </Text>
                        </Pressable>
                    )}
                </View>
            )}

            {!!error &&
                devices.length > 0 &&
                gatewayConnected && (
                    <Text style={styles.errorBanner}>
                        {error}
                    </Text>
                )}

            {/* <View style={styles.deviceCard}>

                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceIcon}>
                        💡
                    </Text>

                    <View>
                        <Text style={styles.deviceName}>
                            Living Room Light
                        </Text>

                        <Text style={styles.deviceType}>
                            Smart Light
                        </Text>
                    </View>
                </View>

                <Text style={styles.deviceStatus}>
                    ON
                </Text>

            </View>

        </View>
    ); */}

            {devices.map((device) => (

                <View
                    key={device.id}
                    style={styles.deviceCard}
                >

                    <View style={styles.deviceInfo}>

                        <Ionicons
                            name={device.icon}
                            size={28}
                            style={styles.deviceIcon}
                        />

                        <View>
                            <Text style={styles.deviceName}>
                                {device.name}
                            </Text>

                            <Text style={styles.deviceType}>
                                {device.type}
                            </Text>

                            <Text style={styles.deviceState}>
                                {updatingDeviceId === device.id
                                    ? 'Updating...'
                                    : device.status
                                        ? 'ON'
                                        : 'OFF'}
                            </Text>
                        </View>

                    </View>

                    <Switch
                        value={device.status}
                        disabled={!gatewayConnected}
                        onValueChange={(value) => {
                            toggleDevice(device.id, value);
                        }}
                    />

                </View>

            ))}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
    },

    greeting: {
        fontSize: 14,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },

    sensorRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
    },

    sensorCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
    },

    sensorLabel: {
        fontSize: 14,
    },

    sensorValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 12,
    },

    deviceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
        marginBottom: 12,
    },

    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deviceIcon: {
        fontSize: 28,
        marginRight: 12,
    },

    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    deviceType: {
        fontSize: 13,
        marginTop: 3,
    },

    deviceStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    deviceState: {
        fontSize: 12,
        marginTop: 3,
        fontWeight: 'bold',
    },

    errorText: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        color: '#d32f2f',
    },

    gatewayBanner: {
        fontSize: 14,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#fff3cd',
        color: '#8a6d00',
        marginTop: 15,
        textAlign: 'center',
    },

    loadingContainer: {
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
    },

    loadingText: {
        fontSize: 14,
        color: '#555555',
    },

    errorContainer: {
        alignItems: 'center',
        marginTop: 10,
        gap: 12,
    },

    errorBanner: {
        fontSize: 14,
        marginBottom: 12,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#fdecea',
        color: '#d32f2f',
        textAlign: 'center',
    },

    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: '#d32f2f',
        alignItems: 'center',
        overflow: 'hidden',
    },

    retryButtonPressed: {
        opacity: 0.8,
    },

    retryButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },

});