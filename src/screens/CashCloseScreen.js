import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, StatusBar, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Card from '../components/Card';
import ModernButton from '../components/ModernButton';
import ModernInput from '../components/ModernInput';
import AbstractBackground from '../components/AbstractBackground';
import { useApp } from '../context/AppContext';
import { Feather } from '@expo/vector-icons';
import { formatCurrency } from '../utils/helpers';

export default function CashCloseScreen() {
  const { theme, cashClose, updateCashClose, closeCash, addCashClose } = useApp();
  const styles = getStyles(theme);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [shift, setShift] = useState('full-day'); // Default shift
  const [openingCash, setOpeningCash] = useState('');

  const handleOpeningCashChange = useCallback((value) => {
    setOpeningCash(value);
  }, []);

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

  const handleClose = async () => {
    if (!cashClose.cash || !cashClose.sales) {
      Alert.alert('Error', 'Por favor ingresa tanto el efectivo en caja como las ventas con tarjeta');
      return;
    }

    const cashCloseData = {
      closingCash: parseFloat(cashClose.cash),
      sales: {
        card: parseFloat(cashClose.sales),
      }
    };

    try {
      let response;
      if (cashClose._id) {
        // If _id exists, it means we are closing an existing cash close
        const dataToClose = { ...cashCloseData, _id: cashClose._id };
        response = await closeCash(dataToClose);
      } else {
        // If _id does not exist, it means we are creating a new cash close
        response = await addCashClose(cashCloseData);
      }
      
      const { difference } = response.data.cashClose;
      let message = `Cierre realizado exitosamente.\nDiferencia: ${formatCurrency(Math.abs(difference))}`;
      if (difference === 0) {
        message += '\n¡Perfecto! No hay diferencia.';
      } else if (difference > 0) {
        message += '\nSobrante en caja.';
      } else {
        message += '\nFaltante en caja.';
      }
      Alert.alert('Cierre de Caja', message);
    } catch (err) {
      Alert.alert('Error de Cierre', err.message || 'No se pudo cerrar la caja.');
    }
  };

  const handleCashChange = useCallback((value) => {
    updateCashClose({ cash: value });
  }, [updateCashClose]);

  const handleSalesChange = useCallback((value) => {
    updateCashClose({ sales: value });
  }, [updateCashClose]);

  const getDifferenceColor = () => {
    if (cashClose.difference === null) return theme.textMuted;
    if (cashClose.difference === 0) return theme.success;
    if (cashClose.difference > 0) return theme.warning;
    return theme.error;
  };

  const getDifferenceIcon = () => {
    if (cashClose.difference === null) return 'minus';
    if (cashClose.difference === 0) return 'check-circle';
    if (cashClose.difference > 0) return 'trending-up';
    return 'trending-down';
  };

  return (
    <AbstractBackground>
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.title}>Cierre de Caja</Text>
            <Text style={styles.subtitle}>Registra el cierre de tu turno</Text>
          </Animated.View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps='handled'
          >
            <>
                <Card variant="elevated" title="Información del Turno" subtitle="Ingresa los datos del cierre">
                  <ModernInput
                    label="Efectivo en Caja"
                    placeholder="Ingresa el efectivo contado"
                    value={cashClose.cash}
                    onChangeText={handleCashChange}
                    keyboardType="numeric"
                    icon="dollar-sign"
                  />

                  <ModernInput
                    label="Ventas con Tarjeta"
                    placeholder="Total de ventas con tarjeta"
                    value={cashClose.sales}
                    onChangeText={handleSalesChange}
                    keyboardType="numeric"
                    icon="credit-card"
                  />

                  <ModernButton
                    title="Cerrar Caja"
                    onPress={handleClose}
                    variant="gradient"
                    size="large"
                    icon="hash"
                    style={styles.closeButton}
                  />
                </Card>

                {cashClose.difference !== null && (
                  <Card variant="elevated" title="Resultado del Cierre" subtitle="Resumen de la operación">
                    <View style={styles.resultContainer}>
                      <View style={[styles.resultIcon, { backgroundColor: getDifferenceColor() + '15' }]}>
                        <Feather name={getDifferenceIcon()} size={24} color={getDifferenceColor()} />
                      </View>
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultLabel}>Diferencia</Text>
                        <Text style={[styles.resultAmount, { color: getDifferenceColor() }]}>
                          {formatCurrency(Math.abs(cashClose.difference))}
                        </Text>
                        <Text style={[styles.resultStatus, { color: getDifferenceColor() }]}>
                          {cashClose.difference === 0 ? 'Perfecto' : cashClose.difference > 0 ? 'Sobrante' : 'Faltante'}
                        </Text>
                      </View>
                    </View>
                  </Card>
                )}

                <Card variant="outlined" title="Resumen Diario" subtitle="Estadísticas del día">
                  <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Ventas con Tarjeta</Text>
                      <Text style={styles.summaryValue}>{formatCurrency(parseFloat(cashClose.sales) || 0)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Efectivo en Caja</Text>
                      <Text style={styles.summaryValue}>{formatCurrency(parseFloat(cashClose.cash) || 0)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                      <Text style={styles.summaryLabel}>Estado</Text>
                      <Text style={[styles.summaryValue, { color: getDifferenceColor() }]}>
                        {cashClose.difference === null ? 'Pendiente' : cashClose.difference === 0 ? 'Balanceado' : 'Desbalanceado'}
                      </Text>
                    </View>
                  </View>
                </Card>
              </>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
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
  closeButton: {
    marginTop: 20,
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  resultIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  resultInfo: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultAmount: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  resultStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    paddingVertical: 20,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});

