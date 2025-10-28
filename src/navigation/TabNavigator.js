import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import InventoryScreen from '../screens/InventoryScreen';
import CashCloseScreen from '../screens/CashCloseScreen';
import ProjectionsScreen from '../screens/ProjectionsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import TPHScreen from '../screens/TPHScreen';
import SettingsScreen from '../screens/SettingsScreen';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          elevation: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          switch (route.name) {
            case 'Dashboard':
              iconName = 'home';
              break;
            case 'CashClose':
              iconName = 'dollar-sign';
              break;
            case 'Inventory':
              iconName = 'package';
              break;
            case 'Projections':
              iconName = 'trending-up';
              break;
            case 'Orders':
              iconName = 'shopping-cart';
              break;
            case 'TPH':
              iconName = 'clock';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Feather 
                name={iconName} 
                color={focused ? colors.white : color} 
                size={focused ? 20 : size} 
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Inicio',
        }}
      />
      <Tab.Screen
        name="CashClose"
        component={CashCloseScreen}
        options={{
          title: 'Caja',
        }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          title: 'Inventario',
        }}
      />
      <Tab.Screen
        name="Projections"
        component={ProjectionsScreen}
        options={{
          title: 'Proyecciones',
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: 'Pedidos',
        }}
      />
      <Tab.Screen
        name="TPH"
        component={TPHScreen}
        options={{
          title: 'TPH',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ajustes',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
});
