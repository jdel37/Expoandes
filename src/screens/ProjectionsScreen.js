import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, StatusBar, Dimensions } from 'react-native';
import colors from '../theme/colors';
import Card from '../components/Card';
import AbstractBackground from '../components/AbstractBackground';
import { LineChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width - 48;

export default function ProjectionsScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

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

  const data = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{ data: [120, 150, 180, 130, 210, 240, 190] }],
  };

  const weeklyStats = [
    { label: 'Mejor día', value: 'Sábado', amount: '$240,000', color: colors.success },
    { label: 'Promedio', value: 'Diario', amount: '$175,000', color: colors.primary },
    { label: 'Proyección', value: 'Mensual', amount: '$5,250,000', color: colors.info },
  ];

  return (
    <AbstractBackground>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Proyecciones</Text>
          <Text style={styles.subtitle}>Análisis de tendencias de ventas</Text>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card variant="elevated" title="Tendencia Semanal" subtitle="Ventas de los últimos 7 días">
            <View style={styles.chartContainer}>
              <LineChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: colors.surface,
                  backgroundGradientFrom: colors.surface,
                  backgroundGradientTo: colors.surface,
                  color: (opacity = 1) => colors.primary,
                  labelColor: () => colors.textMuted,
                  strokeWidth: 3,
                  decimalPlaces: 0,
                  formatYLabel: (value) => `$${value}k`,
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </Card>

          <Card variant="elevated" title="Estadísticas Clave" subtitle="Métricas importantes del período">
            {weeklyStats.map((stat, index) => (
              <View key={index} style={styles.statRow}>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                </View>
                <View style={[styles.statAmount, { backgroundColor: stat.color + '15' }]}>
                  <Text style={[styles.statAmountText, { color: stat.color }]}>
                    {stat.amount}
                  </Text>
                </View>
              </View>
            ))}
          </Card>

          <Card variant="outlined" title="Insights" subtitle="Análisis automático de datos">
            <View style={styles.insightContainer}>
              <View style={styles.insightItem}>
                <Feather name="trending-up" size={20} color={colors.success} />
                <Text style={styles.insightText}>
                  Las ventas han aumentado un 15% esta semana
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Feather name="calendar" size={20} color={colors.info} />
                <Text style={styles.insightText}>
                  Los fines de semana son los más productivos
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Feather name="target" size={20} color={colors.warning} />
                <Text style={styles.insightText}>
                  Objetivo mensual: 85% completado
                </Text>
              </View>
            </View>
          </Card>
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
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  chart: {
    borderRadius: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  statAmount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statAmountText: {
    fontSize: 16,
    fontWeight: '700',
  },
  insightContainer: {
    paddingVertical: 20,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});
