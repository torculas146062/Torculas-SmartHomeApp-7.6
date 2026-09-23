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
          Refreshing sensor data...
        </Text>
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

});