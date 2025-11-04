import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Feather } from '@expo/vector-icons';
import AbstractBackground from '../components/AbstractBackground';
import Card from '../components/Card';
import ModernButton from '../components/ModernButton';
import Charts from '../components/Charts';
import { formatCurrency } from '../utils/helpers';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { theme, calculateStats } = useApp();
  const styles = getStyles(theme);

  const stats = calculateStats();

  const salesData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    values: [150, 220, 180, 250, 230, 300, 280],
  };

  const sections = [
    { 
      name: 'Arqueo de Caja', 
      icon: 'dollar-sign', 
      screen: 'CashClose',
      description: 'Control de ingresos y egresos',
      color: theme.accent
    },
    { 
      name: 'Inventario', 
      icon: 'package', 
      screen: 'Inventory',
      description: 'Gestión de productos',
      color: theme.primary
    },
    { 
      name: 'Proyecciones', 
      icon: 'trending-up', 
      screen: 'Projections',
      description: 'Análisis de tendencias',
      color: theme.info
    },
    { 
      name: 'Pedidos', 
      icon: 'shopping-cart', 
      screen: 'Orders',
      description: 'Gestión de órdenes',
      color: theme.warning
    },
    { 
      name: 'TPH', 
      icon: 'clock', 
      screen: 'TPH',
      description: 'Tiempo por hora',
      color: theme.secondary
    },
    { 
      name: 'Configuración', 
      icon: 'settings', 
      screen: 'Settings',
      description: 'Ajustes del sistema',
      color: theme.textMuted
    },
  ];

  return (
    <AbstractBackground>
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.welcome}>¡Hola, {user?.name || 'Usuario'}! 👋</Text>
            <Text style={styles.subtitle}>Gestiona tu negocio de forma inteligente</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <Card variant="elevated" style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</Text>
                <Text style={styles.statLabel}>Ventas Hoy</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Pedidos</Text>
              </View>
            </Card>
          </View>
        </View>

        <Charts data={salesData} />

        <View style={styles.quickActionsContainer}>
          <ModernButton 
            title="Nuevo Pedido" 
            icon="plus" 
            variant="gradient" 
            onPress={() => navigation.navigate('Orders')} 
            style={styles.quickActionButton} 
          />
          <ModernButton 
            title="Inventario" 
            icon="package" 
            variant="outlined" 
            onPress={() => navigation.navigate('Inventory')} 
            style={styles.quickActionButton} 
          />
        </View>

        <View style={styles.grid}>
          {sections.map((item, i) => (
            <Card
              key={i}
              variant="elevated"
              onPress={() => navigation.navigate(item.screen)}
              style={styles.sectionCard}
            >
              <View style={styles.sectionContent}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                  <Feather name={item.icon} size={24} color={item.color} />
                </View>
                <View style={styles.sectionText}>
                  <Text style={styles.sectionTitle}>{item.name}</Text>
                  <Text style={styles.sectionDescription}>{item.description}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.textMuted} />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </AbstractBackground>
  );
}

const getStyles = (colors) => StyleSheet.create({
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    paddingBottom: 20,
  },
  greeting: {
    marginBottom: 24,
  },
  welcome: {
    fontSize: 28,
    color: colors.text,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statsContainer: {
    marginBottom: 8,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 24,
  },
  quickActionButton: {
    flex: 1,
  },
  grid: {
    gap: 16,
  },
  sectionCard: {
    marginBottom: 0,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});