import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, StatusBar, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Card from '../components/Card';
import AbstractBackground from '../components/AbstractBackground';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const screenWidth = Dimensions.get('window').width - 48;

export default function TPHScreen() {
  const { theme } = useApp();
  const styles = getStyles(theme);
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
    labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm'],
    datasets: [{ data: [3, 5, 8, 12, 6, 4] }],
  };

  const hourlyStats = [
    { hour: '9:00 AM', transactions: 3, efficiency: 'Baja', color: theme.textMuted },
    { hour: '10:00 AM', transactions: 5, efficiency: 'Media', color: theme.warning },
    { hour: '11:00 AM', transactions: 8, efficiency: 'Alta', color: theme.info },
    { hour: '12:00 PM', transactions: 12, efficiency: 'Máxima', color: theme.success },
    { hour: '1:00 PM', transactions: 6, efficiency: 'Media', color: theme.warning },
    { hour: '2:00 PM', transactions: 4, efficiency: 'Baja', color: theme.textMuted },
  ];

  const totalTransactions = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const peakHour = hourlyStats.reduce((max, current) => 
    current.transactions > max.transactions ? current : max
  );

  return (
    <AbstractBackground>
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>TPH</Text>
          <Text style={styles.subtitle}>Transacciones por hora - Análisis de actividad</Text>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card variant="elevated" title="Actividad por Hora" subtitle="Distribución de transacciones">
            <View style={styles.chartContainer}>
              <BarChart
                data={data}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: theme.surface,
                  backgroundGradientFrom: theme.surface,
                  backgroundGradientTo: theme.surface,
                  color: (opacity = 1) => theme.primary,
                  labelColor: () => theme.textMuted,
                  decimalPlaces: 0,
                  barPercentage: 0.7,
                }}
                style={styles.chart}
                showValuesOnTopOfBars
              />
            </View>
          </Card>

          <Card variant="elevated" title="Resumen del Día" subtitle="Métricas de productividad">
            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: theme.primary + '15' }]}>
                  <Feather name="activity" size={20} color={theme.primary} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Total Transacciones</Text>
                  <Text style={styles.summaryValue}>{totalTransactions}</Text>
                </View>
              </View>
              
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: theme.success + '15' }]}>
                  <Feather name="clock" size={20} color={theme.success} />
                </View>
                <View style={styles.summaryInfo}>
                  <Text style={styles.summaryLabel}>Hora Pico</Text>
                  <Text style={styles.summaryValue}>{peakHour.hour}</Text>
                </View>
              </View>
            </View>
          </Card>

          <Card variant="outlined" title="Análisis Detallado" subtitle="Eficiencia por período">
            {hourlyStats.map((stat, index) => (
              <View key={index} style={styles.hourRow}>
                <View style={styles.hourInfo}>
                  <Text style={styles.hourTime}>{stat.hour}</Text>
                  <Text style={styles.hourTransactions}>{stat.transactions} transacciones</Text>
                </View>
                <View style={[styles.efficiencyBadge, { backgroundColor: stat.color + '15' }]}>
                  <Text style={[styles.efficiencyText, { color: stat.color }]}>
                    {stat.efficiency}
                  </Text>
                </View>
              </View>
            ))}
          </Card>
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
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  chart: {
    borderRadius: 16,
  },
  summaryContainer: {
    paddingVertical: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '700',
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  hourInfo: {
    flex: 1,
  },
  hourTime: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  hourTransactions: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  efficiencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  efficiencyText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
