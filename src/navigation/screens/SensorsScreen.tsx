import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function SensorsScreen() {

  const {
    sensors,
    refreshSensors,
    isRefreshingSensors,
    sensorError,
    gatewayConnected,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      {!gatewayConnected && (
        <Text style={styles.gatewayBanner}>
          IoT Gateway is disconnected.
        </Text>
      )}

      {/* Temperature */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="thermometer-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Temperature
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {isRefreshingSensors
            ? '—'
            : `${sensors.temperature}°C`}
        </Text>

        <Text style={styles.sensorDescription}>
          Current room temperature
        </Text>

      </View>

      {/* Humidity */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="water-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Humidity
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {isRefreshingSensors
            ? '—'
            : `${sensors.humidity}%`}
        </Text>

        <Text style={styles.sensorDescription}>
          Current relative humidity
        </Text>

      </View>

      {/* Light Level */}
      <View style={styles.sensorCard}>

        <View style={styles.sensorHeader}>

          <Ionicons
            name="sunny-outline"
            size={30}
          />

          <Text style={styles.sensorName}>
            Light Level
          </Text>

        </View>

        <Text style={styles.sensorValue}>
          {isRefreshingSensors
            ? '—'
            : `${sensors.lightLevel} lux`}
        </Text>

        <Text style={styles.sensorDescription}>
          Current ambient light
        </Text>

      </View>

      {/* Refresh */}
      <Pressable
        style={({ pressed }) => [
          styles.refreshButton,
          pressed && styles.refreshButtonPressed,
        ]}
        onPress={refreshSensors}
        disabled={isRefreshingSensors}
        android_ripple={{ color: '#ffffff55' }}
      >
        {isRefreshingSensors ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.refreshButtonText}>
            Refresh Sensors
          </Text>
        )}
      </Pressable>

      {isRefreshingSensors && (
        <Text style={styles.refreshingText}>
          Refreshing Sensors...
        </Text>
      )}

      {!isRefreshingSensors &&
        gatewayConnected &&
        sensorError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {sensorError}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.retryButtonPressed,
              ]}
              onPress={refreshSensors}
              android_ripple={{ color: '#ffffff55' }}
            >
              <Text style={styles.retryButtonText}>
                Retry
              </Text>
            </Pressable>
          </View>
        )}

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

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },

  refreshButton: {
    marginTop: 5,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#0a84ff',
    alignItems: 'center',
    overflow: 'hidden',
  },

  refreshButtonPressed: {
    opacity: 0.8,
  },

  refreshButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  refreshingText: {
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
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
    marginTop: 15,
    alignItems: 'center',
    gap: 10,
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#d32f2f',
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