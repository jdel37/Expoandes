import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, StatusBar, Dimensions } from 'react-native';
import Card from '../components/Card';
import AbstractBackground from '../components/AbstractBackground';
import { LineChart } from 'react-native-chart-kit';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import apiService from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/helpers';

const screenWidth = Dimensions.get('window').width - 48;

export default function ProjectionsScreen() {
  const { theme } = useApp();
  const styles = getStyles(theme);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [loading, setLoading] = useState(true);
  const [projectionsData, setProjectionsData] = useState(null);

  useEffect(() => {
    const fetchProjections = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjections('week');
        setProjectionsData(data);
      } catch (error) {
        console.error('Error fetching projections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
  }, []);

  React.useEffect(() => {
    if (!loading) {
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
    }
  }, [loading]);

  if (loading || !projectionsData?.data) {
    return <LoadingSpinner text="Cargando proyecciones..." />;
  }

  const { historicalData, projections: projectionStats } = projectionsData.data;

  const chartData = {
    labels: historicalData.map(d => `${d._id.day}/${d._id.month}`),
    datasets: [{ data: historicalData.map(d => d.totalRevenue) }],
  };

  const bestDay = historicalData.reduce((max, d) => d.totalRevenue > max.totalRevenue ? d : max, historicalData[0] || { _id: {}, totalRevenue: 0 });
  const averageSales = historicalData.reduce((sum, d) => sum + d.totalRevenue, 0) / (historicalData.length || 1);

  const weeklyStats = [
    { label: 'Mejor día', value: bestDay._id.day ? `${bestDay._id.day}/${bestDay._id.month}` : 'N/A', amount: formatCurrency(bestDay.totalRevenue), color: theme.success },
    { label: 'Promedio Diario', value: '', amount: formatCurrency(averageSales), color: theme.primary },
    { label: 'Proyección Próxima Semana', value: '', amount: formatCurrency(projectionStats.nextPeriod), color: theme.info },
  ];

  return (
    <AbstractBackground>
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Proyecciones</Text>
          <Text style={styles.subtitle}>Análisis de tendencias de ventas</Text>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card variant="elevated" title="Tendencia Semanal" subtitle="Ventas de los últimos 30 días">
            <View style={styles.chartContainer}>
              {chartData.datasets[0].data.length > 0 ? (
                <LineChart
                  data={chartData}
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: theme.surface,
                    backgroundGradientFrom: theme.surface,
                    backgroundGradientTo: theme.surface,
                    color: (opacity = 1) => theme.primary,
                    labelColor: () => theme.textMuted,
                    strokeWidth: 3,
                    decimalPlaces: 0,
                    formatYLabel: (value) => formatCurrency(value, true),
                  }}
                  bezier
                  style={styles.chart}
                />
              ) : (
                <Text style={styles.noDataText}>No hay suficientes datos para mostrar la gráfica.</Text>
              )}
            </View>
          </Card>

          <Card variant="elevated" title="Estadísticas Clave" subtitle="Métricas importantes del período">
            {weeklyStats.map((stat, index) => (
              <View key={index} style={styles.statRow}>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  {stat.value ? <Text style={styles.statValue}>{stat.value}</Text> : null}
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
                <Feather name="trending-up" size={20} color={theme.success} />
                <Text style={styles.insightText}>
                  La tendencia de ventas es {projectionStats.trend === 'increasing' ? 'creciente' : (projectionStats.trend === 'decreasing' ? 'decreciente' : 'estable')}.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Feather name="calendar" size={20} color={theme.info} />
                <Text style={styles.insightText}>
                  La proyección para la próxima semana es de {formatCurrency(projectionStats.nextPeriod)}.
                </Text>
              </View>
              <View style={styles.insightItem}>
                <Feather name="target" size={20} color={theme.warning} />
                <Text style={styles.insightText}>
                  Confianza de la proyección: {projectionStats.confidence === 'high' ? 'Alta' : (projectionStats.confidence === 'medium' ? 'Media' : 'Baja')}
                </Text>
              </View>
            </View>
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
  noDataText: {
    color: colors.textMuted,
    fontSize: 14,
    paddingVertical: 20,
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
