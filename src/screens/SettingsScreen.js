import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, StatusBar, Alert, Switch } from 'react-native';

import Card from '../components/Card';
import ModernButton from '../components/ModernButton';
import AbstractBackground from '../components/AbstractBackground';
import { AuthContext } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { logout, user } = useContext(AuthContext);
  const { theme, notifications, darkMode, toggleNotifications, toggleDarkMode, setLanguage, lowStockThreshold, mediumStockThreshold, setLowStockThreshold, setMediumStockThreshold, updatePreferences } = useApp();
  const styles = getStyles(theme);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const navigation = useNavigation();

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar' },
      { text: 'Salir', onPress: () => { logout(); navigation.replace('Login'); } },
    ]);
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Cambiar Idioma',
      'Selecciona tu idioma preferido',
      [
        { text: 'Español', onPress: () => setLanguage('es') },
        { text: 'English', onPress: () => setLanguage('en') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleSync = () => {
    Alert.alert(
      'Sincronizar Datos',
      '¿Deseas sincronizar todos los datos con el servidor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sincronizar', 
          onPress: () => {
            // Simulate sync
            Alert.alert('Éxito', 'Datos sincronizados correctamente');
          }
        }
      ]
    );
  };

  const settingsOptions = [
    {
      title: 'Notificaciones',
      subtitle: 'Recibe alertas importantes',
      icon: 'bell',
      color: theme.info,
      type: 'switch',
      value: notifications,
      onPress: toggleNotifications
    },
    {
      title: 'Modo Oscuro',
      subtitle: 'Tema oscuro para mejor visibilidad',
      icon: 'moon',
      color: theme.secondary,
      type: 'switch',
      value: darkMode,
      onPress: toggleDarkMode
    },
    {
      title: 'Idioma',
      subtitle: 'Español',
      icon: 'globe',
      color: theme.warning,
      type: 'arrow',
      onPress: handleLanguageChange
    },
    {
      title: 'Sincronización',
      subtitle: 'Última sincronización: hace 5 min',
      icon: 'refresh-cw',
      color: theme.primary,
      type: 'arrow',
      onPress: handleSync
    },
  ];

  return (
    <AbstractBackground>
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Configuración</Text>
          
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card variant="elevated" title="Perfil de Usuario" subtitle="Información de tu cuenta">
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Feather name="user" size={24} color={theme.white} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Text style={styles.userRole}>Administrador</Text>
              </View>
            </View>
          </Card>

          <Card variant="elevated" title="Preferencias" subtitle="Configura tu experiencia">
            {settingsOptions.map((option, index) => (
              <View key={index} style={styles.optionRow}>
                <View style={[styles.optionIcon, { backgroundColor: option.color + '15' }]}>
                  <Feather name={option.icon} size={20} color={option.color} />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={styles.optionAction}>
                  {option.type === 'switch' ? (
                    <Switch
                      value={option.value}
                      onValueChange={option.onPress}
                      trackColor={{ false: theme.gray300, true: option.color }}
                      thumbColor={option.value ? theme.white : theme.gray500}
                    />
                  ) : (
                    <Feather name="chevron-right" size={20} color={theme.textMuted} />
                  )}
                </View>
              </View>
            ))}
          </Card>



          <Card variant="outlined" title="Información de la App" subtitle="Detalles del sistema">
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Versión</Text>
                <Text style={styles.infoValue}>1.0.0</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Última actualización</Text>
                <Text style={styles.infoValue}>8 Nov 2025</Text>
              </View>
              
            </View>
          </Card>

          <ModernButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="outline"
            size="large"
            icon="log-out"
            style={styles.logoutButton}
          />
        </ScrollView>
      </Animated.View>
    </AbstractBackground>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  optionAction: {
    marginLeft: 12,
  },
  infoContainer: {
    paddingVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 30,
  },
  sliderContainer: {
    paddingVertical: 16,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sliderValue: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
});

