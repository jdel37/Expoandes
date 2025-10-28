import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import { Feather } from '@expo/vector-icons';
import AbstractBackground from '../components/AbstractBackground';
import Card from '../components/Card';
import ModernButton from '../components/ModernButton';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { calculateStats } = useApp();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

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

  const stats = calculateStats();

  const sections = [
    { 
      name: 'Arqueo de Caja', 
      icon: 'dollar-sign', 
      screen: 'CashClose',
      description: 'Control de ingresos y egresos',
      color: colors.accent
    },
    { 
      name: 'Inventario', 
      icon: 'package', 
      screen: 'Inventory',
      description: 'Gestión de productos',
      color: colors.primary
    },
    { 
      name: 'Proyecciones', 
      icon: 'trending-up', 
      screen: 'Projections',
      description: 'Análisis de tendencias',
      color: colors.info
    },
    { 
      name: 'Pedidos', 
      icon: 'shopping-cart', 
      screen: 'Orders',
      description: 'Gestión de órdenes',
      color: colors.warning
    },
    { 
      name: 'TPH', 
      icon: 'clock', 
      screen: 'TPH',
      description: 'Tiempo por hora',
      color: colors.secondary
    },
    { 
      name: 'Configuración', 
      icon: 'settings', 
      screen: 'Settings',
      description: 'Ajustes del sistema',
      color: colors.textMuted
    },
  ];

  return (
    <AbstractBackground>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.greeting}>
            <Text style={styles.welcome}>¡Hola, {user?.name || 'Usuario'}! 👋</Text>
            <Text style={styles.subtitle}>Gestiona tu negocio de forma inteligente</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <Card variant="elevated" style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>${stats.totalRevenue.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Ventas Hoy</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Pedidos</Text>
              </View>
            </Card>
          </View>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View style={[styles.grid, { opacity: fadeAnim }]}>
            {sections.map((item, i) => (
              <Card
                key={i}
                variant="elevated"
                onPress={() => navigation.navigate(item.screen)}
                style={[styles.sectionCard, { animationDelay: i * 100 }]}
              >
                <View style={styles.sectionContent}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                    <Feather name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={styles.sectionText}>
                    <Text style={styles.sectionTitle}>{item.name}</Text>
                    <Text style={styles.sectionDescription}>{item.description}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.textMuted} />
                </View>
              </Card>
            ))}
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </AbstractBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
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
