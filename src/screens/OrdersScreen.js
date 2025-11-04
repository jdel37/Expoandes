import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, StatusBar, Alert, TouchableOpacity } from 'react-native';
import Card from '../components/Card';
import ModernButton from '../components/ModernButton';
import AbstractBackground from '../components/AbstractBackground';
import AddItemModal from '../components/AddItemModal';
import { useApp } from '../context/AppContext';
import { Feather } from '@expo/vector-icons';
import { formatCurrency } from '../utils/helpers';

export default function OrdersScreen() {
  const { theme, orders, addOrder, updateOrderStatus, deleteOrder, calculateStats } = useApp();
  const styles = getStyles(theme);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado': return theme.success;
      case 'Pendiente': return theme.warning;
      case 'En Proceso': return theme.info;
      default: return theme.textMuted;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Entregado': return 'check-circle';
      case 'Pendiente': return 'clock';
      case 'En Proceso': return 'loader';
      default: return 'circle';
    }
  };

  const handleAddOrder = (orderData) => {
    addOrder(orderData)
      .then(() => {
        setShowAddModal(false);
      })
      .catch(err => {
        setShowAddModal(false);
        Alert.alert('Error al Agregar', err.message || 'No se pudo agregar el pedido. Verifique los datos.');
      });
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setShowAddModal(true);
  };

  const handleUpdateOrder = (orderData) => {
    // Update order logic would go here
    setEditingOrder(null);
    setShowAddModal(false);
  };

  const handleDeleteOrder = (order) => {
    Alert.alert(
      'Eliminar Pedido',
      `¿Estás seguro de que quieres eliminar el pedido de "${order.customer}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteOrder(order.id)
        }
      ]
    );
  };

  const handleStatusChange = (order) => {
    const statuses = ['Pendiente', 'En Proceso', 'Entregado'];
    const currentIndex = statuses.indexOf(order.status);
    const nextIndex = (currentIndex + 1) % statuses.length;
    const newStatus = statuses[nextIndex];
    
    updateOrderStatus(order.id, newStatus);
  };

  const stats = calculateStats();

  return (
    <AbstractBackground>
      <StatusBar barStyle={theme.darkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Pedidos</Text>
          <Text style={styles.subtitle}>Gestiona las órdenes del día</Text>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card variant="elevated" title="Resumen del Día" subtitle="Estadísticas de pedidos">
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Pedidos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{stats.completedOrders}</Text>
                <Text style={styles.statLabel}>Completados</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{formatCurrency(stats.totalRevenue)}</Text>
                <Text style={styles.statLabel}>Ingresos</Text>
              </View>
            </View>
          </Card>

          <Card variant="elevated" title="Pedidos Recientes" subtitle="Lista de órdenes activas">
            {orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <TouchableOpacity 
                  style={[styles.orderIcon, { backgroundColor: getStatusColor(order.status) + '15' }]}
                  onPress={() => handleStatusChange(order)}
                >
                  <Feather name={getStatusIcon(order.status)} size={20} color={getStatusColor(order.status)} />
                </TouchableOpacity>
                <View style={styles.orderInfo}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.customerName}>{order.customer.name}</Text>
                    <Text style={styles.orderTime}>{new Date(order.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <View style={styles.orderDetails}>
                    <Text style={styles.orderItems}>{order.items.length} productos</Text>
                    <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                  </View>
                </View>
                <View style={styles.orderActions}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditOrder(order)}
                    >
                      <Feather name="edit" size={16} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteOrder(order)}
                    >
                      <Feather name="trash-2" size={16} color={theme.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </Card>

          <ModernButton
            title="Nuevo Pedido"
            onPress={() => setShowAddModal(true)}
            variant="gradient"
            size="large"
            icon="plus"
            style={styles.newOrderButton}
          />

          <AddItemModal
            visible={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setEditingOrder(null);
            }}
            onAdd={editingOrder ? handleUpdateOrder : handleAddOrder}
            type="order"
            editItem={editingOrder}
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
  statsContainer: {
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
  orderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  orderTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItems: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  orderTotal: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newOrderButton: {
    marginTop: 20,
  },
});
