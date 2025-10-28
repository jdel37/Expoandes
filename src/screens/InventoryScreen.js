import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, StatusBar, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import ModernButton from '../components/ModernButton';
import AbstractBackground from '../components/AbstractBackground';
import AddItemModal from '../components/AddItemModal';
import { useApp } from '../context/AppContext';
import colors from '../theme/colors';
import { Feather } from '@expo/vector-icons';

export default function InventoryScreen() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, getStockStatus } = useApp();
  const { user } = useContext(AuthContext);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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

  const handleAddItem = (itemData) => {
    if (!user) {
      Alert.alert('Error de Autenticación', 'El objeto de usuario no está disponible. Por favor, inicia sesión de nuevo.');
      return;
    }
    if (!user.restaurant) {
      Alert.alert('Error de Datos', 'El objeto de usuario no contiene la información del restaurante. Por favor, contacta a soporte.');
      console.log('User object without restaurant property:', JSON.stringify(user, null, 2));
      return;
    }

    const itemWithOwner = {
      ...itemData,
      restaurant: user.restaurant,
    };

    addInventoryItem(itemWithOwner)
      .then(() => {
        setShowAddModal(false);
      })
      .catch(err => {
        setShowAddModal(false);
        Alert.alert('Error al Agregar', err.message || 'No se pudo agregar el producto. Verifique los datos.');
      });
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleUpdateItem = (itemData) => {
    updateInventoryItem(editingItem.id, itemData);
    setEditingItem(null);
    setShowAddModal(false);
  };

  const handleDeleteItem = (item) => {
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${item.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => deleteInventoryItem(item.id)
        }
      ]
    );
  };

  const handleUpdateQuantity = (item, newQty) => {
    if (newQty < 0) return;
    updateInventoryItem(item.id, { quantity: newQty });
  };

  return (
    <AbstractBackground>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.header, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Inventario</Text>
          <Text style={styles.subtitle}>Gestiona tus productos y stock</Text>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Card variant="elevated" title="Resumen de Stock" subtitle="Estado actual del inventario">
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{inventory.length}</Text>
                <Text style={styles.statLabel}>Productos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {inventory.filter(item => item.quantity <= 5).length}
                </Text>
                <Text style={styles.statLabel}>Bajo Stock</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  ${inventory.reduce((sum, item) => sum + (item.quantity * item.costPrice), 0).toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Valor Total</Text>
              </View>
            </View>
          </Card>

          <Card variant="elevated" title="Productos" subtitle="Lista de inventario actual">
            {inventory.map((item, i) => {
              const stockStatus = getStockStatus(item.quantity);
              return (
                <View key={item.id} style={styles.itemCard}>
                  <View style={[styles.itemIcon, { backgroundColor: item.color + '15' }]}>
                    <Feather name="package" size={20} color={item.color} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <View style={styles.itemDetails}>
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                          style={styles.qtyButton}
                          onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
                        >
                          <Feather name="minus" size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                        <Text style={styles.itemQty}>{item.quantity}</Text>
                        <TouchableOpacity 
                          style={styles.qtyButton}
                          onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
                        >
                          <Feather name="plus" size={16} color={colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.itemCost}>${item.costPrice.toLocaleString()}</Text>
                    </View>
                  </View>
                  <View style={styles.itemActions}>
                    <View style={[styles.stockBadge, { backgroundColor: stockStatus.color + '15' }]}>
                      <Text style={[styles.stockText, { color: stockStatus.color }]}>
                        {stockStatus.status}
                      </Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditItem(item)}
                      >
                        <Feather name="edit" size={16} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteItem(item)}
                      >
                        <Feather name="trash-2" size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </Card>

          <ModernButton
            title="Agregar Producto"
            onPress={() => {
              setEditingItem(null);
              setShowAddModal(true);
            }}
            variant="gradient"
            size="large"
            icon="plus"
            style={styles.addButton}
          />

          <AddItemModal
            visible={showAddModal}
            onClose={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
            onAdd={editingItem ? handleUpdateItem : handleAddItem}
            type="inventory"
            editItem={editingItem}
          />
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemQty: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  itemCost: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  addButton: {
    marginTop: 20,
  },
});
