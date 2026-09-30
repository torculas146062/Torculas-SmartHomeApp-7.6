import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import DrawerNavigator from './src/navigation/DrawerNavigator';
import { IoTProvider } from './src/context/IoTContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <IoTProvider>
        <ThemedNavigation />
      </IoTProvider>
    </ThemeProvider>
  );
}

/**
 * Rendered inside `ThemeProvider` so the navigation container, status bar and
 * background all follow the active theme.
 */
function ThemedNavigation() {

  const { isReady, isDark, colors, navigationTheme } = useTheme();

  // Avoid flashing the light theme while the saved preference is read.
  if (!isReady) {
    return (
      <View
        style={[
          styles.placeholder,
          { backgroundColor: colors.background },
        ]}
      />
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <NavigationContainer theme={navigationTheme}>
        <DrawerNavigator />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

  placeholder: {
    flex: 1,
  },

});