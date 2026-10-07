import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';
import { createThemedStyles, useTheme } from '../../context/ThemeContext';



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
        isConnectingGateway,
        isLoading,
        error,
        retryDevices } = useIoT();

    const { colors } = useTheme();
    const styles = useStyles();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >

            <Text style={styles.greeting}>
                Good evening
            </Text>

            <Text style={styles.title}>
                IoT Dashboard
            </Text>

            {!gatewayConnected && !isConnectingGateway && (
                <Text style={styles.gatewayBanner}>
                    IoT Gateway is disconnected.
                </Text>
            )}

            <View style={styles.sensorRow}>

                <View style={styles.sensorCard}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="thermometer-outline"
                            size={22}
                            color={colors.text}
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
                            color={colors.text}
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

            {(isLoading || isConnectingGateway) && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />

                    <Text style={styles.loadingText}>
                        Loading devices...
                    </Text>
                </View>
            )}

            {!isLoading &&
                !isConnectingGateway &&
                devices.length === 0 && (
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
                                color: colors.ripple,
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
                            color={colors.text}
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
        </ScrollView>
    );
}

/**
 * Styles are rebuilt only when the theme changes (see `createThemedStyles`),
 * so every colour comes from the active palette.
 */
const useStyles = createThemedStyles((c) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: c.background,
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    greeting: {
        fontSize: 14,
        color: c.textMuted,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
        color: c.text,
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
        backgroundColor: c.surface,
    },

    sensorLabel: {
        fontSize: 14,
        color: c.textMuted,
    },

    sensorValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
        color: c.text,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 12,
        color: c.text,
    },

    deviceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        backgroundColor: c.surface,
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
        color: c.text,
    },

    deviceType: {
        fontSize: 13,
        marginTop: 3,
        color: c.textMuted,
    },

    deviceStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        color: c.text,
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
        color: c.textMuted,
    },

    errorText: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        color: c.danger,
    },

    gatewayBanner: {
        fontSize: 14,
        padding: 12,
        borderRadius: 10,
        backgroundColor: c.warningSurface,
        color: c.warning,
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
        color: c.textMuted,
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
        backgroundColor: c.dangerSurface,
        color: c.danger,
        textAlign: 'center',
    },

    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: c.danger,
        alignItems: 'center',
        overflow: 'hidden',
    },

    retryButtonPressed: {
        opacity: 0.8,
    },

    retryButtonText: {
        color: c.onAccent,
        fontSize: 15,
        fontWeight: 'bold',
    },

}));