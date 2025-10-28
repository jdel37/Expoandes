import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SocketProvider } from './src/context/SocketContext';
import colors from './src/theme/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <SocketProvider>
            <StatusBar style="dark" backgroundColor={colors.background} />
            <AppNavigator />
          </SocketProvider>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
