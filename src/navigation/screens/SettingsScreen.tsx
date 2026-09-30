import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';
import { createThemedStyles, useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {

  const [notifications, setNotifications] = useState(true);

  const {
    colors,
    isDark,
    preference,
    setDarkMode,
  } = useTheme();

  const styles = useStyles();

  const {
    gatewayConnected,
    isConnectingGateway,
    connectGateway,
    disconnectGateway,
    error,
  } = useIoT();

  const gatewayStatus = isConnectingGateway
    ? 'Connecting...'
    : gatewayConnected
      ? 'Connected'
      : 'Disconnected';

  return (
    <ScrollView style={styles.container}>

      {/* Header */}

      <Text style={styles.title}>
        Settings
      </Text>

      <Text style={styles.subtitle}>
        Configure your IoT application
      </Text>


      {/* General Settings */}

      <Text style={styles.sectionTitle}>
        General
      </Text>


      {/* Notifications */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="notifications-outline"
            size={26}
            color={colors.text}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Notifications
            </Text>

            <Text style={styles.settingDescription}>
              Receive alerts from your IoT devices
            </Text>

          </View>

        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />

      </View>


      {/* Auto Connect */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="wifi-outline"
            size={26}
            color={colors.text}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Auto Connect
            </Text>

            <Text style={styles.settingDescription}>
              Automatically connect to the IoT gateway
            </Text>

          </View>

        </View>

        <Switch
          value={gatewayConnected}
          disabled={isConnectingGateway}
          onValueChange={(value) => {
            if (value) {
              connectGateway();
            } else {
              disconnectGateway();
            }
          }}
        />

      </View>


      {/* Dark Mode */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="moon-outline"
            size={26}
            color={colors.text}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Dark Mode
            </Text>

            <Text style={styles.settingDescription}>
              {preference === 'system'
                ? 'Following the system appearance'
                : 'Use a darker application appearance'}
            </Text>

          </View>

        </View>

        <Switch
          value={isDark}
          onValueChange={setDarkMode}
        />

      </View>


      {/* Connection */}

      <Text style={styles.sectionTitle}>
        Connection
      </Text>


      <View style={styles.connectionCard}>

        <View style={styles.connectionInfo}>

          {isConnectingGateway ? (
            <ActivityIndicator
              size="small"
              color={colors.textMuted}
            />
          ) : (
            <Ionicons
              name={
                gatewayConnected
                  ? 'cloud-done-outline'
                  : 'cloud-offline-outline'
              }
              size={30}
              color={colors.text}
            />
          )}

          <View>

            <Text style={styles.connectionTitle}>
              IoT Gateway
            </Text>

            <Text style={styles.connectionStatus}>
              {gatewayStatus}
            </Text>

          </View>

        </View>

        {!!error && (
          <Text style={styles.connectionError}>
            {error}
          </Text>
        )}

        {!gatewayConnected && !isConnectingGateway && (
          <Pressable
            style={({ pressed }) => [
              styles.connectButton,
              pressed && styles.connectButtonPressed,
            ]}
            onPress={() => {
              connectGateway();
            }}
            android_ripple={{ color: colors.ripple }}
          >
            <Text style={styles.connectButtonText}>
              Reconnect
            </Text>
          </Pressable>
        )}

      </View>

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

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
    color: c.text,
  },

  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: c.surface,
    marginBottom: 12,
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingText: {
    marginLeft: 15,
    flex: 1,
  },

  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: c.text,
  },

  settingDescription: {
    fontSize: 12,
    marginTop: 4,
    color: c.textMuted,
  },

  connectionCard: {
    padding: 18,
    borderRadius: 15,
    backgroundColor: c.surface,
  },

  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  connectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
    color: c.text,
  },

  connectionStatus: {
    fontSize: 13,
    marginLeft: 15,
    marginTop: 3,
    color: c.textMuted,
  },

  connectionError: {
    fontSize: 13,
    marginTop: 12,
    color: c.danger,
  },

  connectButton: {
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: c.primary,
    alignItems: 'center',
    overflow: 'hidden',
  },

  connectButtonPressed: {
    opacity: 0.8,
  },

  connectButtonText: {
    color: c.onAccent,
    fontSize: 15,
    fontWeight: 'bold',
  },

}));