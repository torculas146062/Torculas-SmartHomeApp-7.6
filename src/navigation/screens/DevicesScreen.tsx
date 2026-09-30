import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';
import { createThemedStyles, useTheme } from '../../context/ThemeContext';

export default function DevicesScreen() {

  const {
    devices,
    toggleDevice,
    updatingDeviceId,
    gatewayConnected,
    isConnectingGateway,
    isLoading,
    error,
    retryDevices,
  } = useIoT();

  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {!gatewayConnected && !isConnectingGateway && (
        <Text style={styles.gatewayBanner}>
          IoT Gateway is disconnected.
        </Text>
      )}

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
                pressed && styles.retryButtonPressed,
              ]}
              onPress={retryDevices}
              android_ripple={{ color: colors.ripple }}
            >
              <Text style={styles.retryButtonText}>
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

      {devices.map((device) => (

        <View
          key={device.id}
          style={styles.deviceCard}
        >

          <View style={styles.deviceInfo}>

            <View style={styles.iconContainer}>

              <Ionicons
                name={device.icon}
                size={28}
                color={colors.text}
              />

            </View>

            <View style={styles.deviceDetails}>

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
    padding: 20,
    backgroundColor: c.background,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: c.text,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
    color: c.textMuted,
  },

  loader: {
    marginTop: 40,
  },

  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
    gap: 10,
  },

  loadingText: {
    fontSize: 14,
    color: c.textMuted,
  },

  gatewayBanner: {
    fontSize: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: c.warningSurface,
    color: c.warning,
    marginBottom: 15,
    textAlign: 'center',
  },

  errorContainer: {
    alignItems: 'center',
    marginTop: 20,
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

  errorText: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    color: c.danger,
  },

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: c.surface,
    marginBottom: 15,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: c.surfaceMuted,
  },

  deviceDetails: {
    flex: 1,
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

  deviceState: {
    fontSize: 12,
    marginTop: 5,
    color: c.textMuted,
  },

}));