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

export default function DevicesScreen() {

  const {
    devices,
    toggleDevice,
    updatingDeviceId,
    gatewayConnected,
    isLoading,
    error,
    retryDevices,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {!gatewayConnected && (
        <Text style={styles.gatewayBanner}>
          IoT Gateway is disconnected.
        </Text>
      )}

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
                pressed && styles.retryButtonPressed,
              ]}
              onPress={retryDevices}
              android_ripple={{ color: '#ffffff55' }}
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
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
    color: '#555555',
  },

  gatewayBanner: {
    fontSize: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff3cd',
    color: '#8a6d00',
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

  errorText: {
    fontSize: 14,
    marginTop: 20,
    textAlign: 'center',
    color: '#d32f2f',
  },

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
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
  },

  deviceDetails: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },

  deviceState: {
    fontSize: 12,
    marginTop: 5,
  },

});