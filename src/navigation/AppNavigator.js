// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import { AuthProvider } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,   // ✅ Debe ser boolean, sin comillas
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={TabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SocketProvider>
    </AuthProvider>
  );
}
