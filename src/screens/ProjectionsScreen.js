import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import Card from '../components/Card';
import AbstractBackground from '../components/AbstractBackground';
import Charts from '../components/Charts';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { AuthContext } from '../context/AuthContext';
import apiService from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/helpers';
import ModernInput from '../components/ModernInput';
import ModernButton from '../components/ModernButton';

export default function ProjectionsScreen() {
  const { theme, reloadData } = useApp();
  const styles = getStyles(theme);
  const [utilityChartData, setUtilityChartData] = useState({
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    values: [0, 0, 0, 0, 0, 0, 0],
  });

  const [proveedoresNominaImpuestos, setProveedoresNominaImpuestos] = useState('');
  const [gastosOperativos, setGastosOperativos] = useState('');
  const [gastosFinancieros, setGastosFinancieros] = useState('');

  const calculateProjectedDailyUtility = async () => {
    try {
      const monthlyExpenses = 
        (parseFloat(proveedoresNominaImpuestos) || 0) +
        (parseFloat(gastosOperativos) || 0) +
        (parseFloat(gastosFinancieros) || 0);
      
      const dailyExpense = monthlyExpenses / 30;

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 6); // Last 7 days

      const response = await apiService.getSalesAnalytics(startDate, endDate, 'day');
      
      const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const dailyData = new Map();

      // Initialize data for the last 7 days with 0 profit
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        dailyData.set(dateString, {
          label: daysOfWeek[date.getDay()],
          value: 0
        });
      }

      response.data.salesData.forEach(item => {
        const date = new Date(item._id);
        const dateString = date.toISOString().split('T')[0];
        if (dailyData.has(dateString)) {
          // Subtract dailyExpense from totalProfit to get projected daily utility
          dailyData.get(dateString).value = item.totalProfit - dailyExpense;
        }
      });

      const labels = [];
      const values = [];
      // Iterate through the map in chronological order of dates
      Array.from(dailyData.keys()).sort().forEach(dateString => {
        const data = dailyData.get(dateString);
        labels.push(data.label);
        values.push(data.value);
      });

      setUtilityChartData({ labels, values });

    } catch (error) {
      console.error('Error calculating projected daily utility:', error);
      // Optionally, set an error state or show an alert
    }
  };

  useEffect(() => {
    // Initial fetch/calculation when component mounts
    calculateProjectedDailyUtility();
  }, [reloadData]); // Recalculate when reloadData changes or monthly inputs change

  return (
    <AbstractBackground>
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Proyecciones</Text>
          <Text style={styles.subtitle}>Análisis de tendencias de utilidad</Text>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Charts data={utilityChartData} />

          <Card variant="elevated" title="Utilidad por Pedidos Entregados" subtitle="Utilidad efectiva de los últimos 7 días">
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Utilidad</Text>
              <Text style={styles.statValue}>{formatCurrency(utilityChartData.values.reduce((sum, val) => sum + val, 0))}</Text>
            </View>
          </Card>

          <Card variant="elevated" title="Pagos y Obligaciones Mensuales" subtitle="Monto mensual (proveedores, nómina, impuestos)">
                      <ModernInput
                        placeholder="Monto total mensual"
                        keyboardType="numeric"
                        value={proveedoresNominaImpuestos}
                        onChangeText={setProveedoresNominaImpuestos}
                      />
                      </Card>
            
                      <Card variant="elevated" title="Gastos Operativos" subtitle="Monto mensual (renta, nómina administrativa, servicios, marketing, software, etc.)">
                        <ModernInput
                          placeholder="Monto total mensual"
                          keyboardType="numeric"
                          value={gastosOperativos}
                          onChangeText={setGastosOperativos}
                        />
                      </Card>
            
                      <Card variant="elevated" title="Gastos Financieros" subtitle="Monto mensual (intereses, comisiones bancarias)">
                        <ModernInput
                          placeholder="Monto total mensual"
                          keyboardType="numeric"
                          value={gastosFinancieros}
                          onChangeText={setGastosFinancieros}
                        />
                      </Card>
            
                      <ModernButton
                        onPress={calculateProjectedDailyUtility}
                        title="Calcular Proyección Diaria"
                        variant="primary"
                        style={{ marginTop: 20, marginBottom: 20 }}
                      />


        </ScrollView>
      </View>
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
});
