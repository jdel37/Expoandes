import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SectionList,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Card from './Card';
import ModernInput from './ModernInput';
import ModernButton from './ModernButton';
import { useApp } from '../context/AppContext';
import { Feather } from '@expo/vector-icons';
import { formatCurrency } from '../utils/helpers';

export default function AddItemModal({
  visible,
  onClose,
  onAdd,
  type = 'inventory',
  editItem = null
}) {
  const { theme, inventory } = useApp();
  const styles = getStyles(theme);
  const getInitialState = () => ({
    name: editItem?.name || '',
    quantity: editItem?.quantity?.toString() || '',
    costPrice: editItem?.costPrice?.toString() || '',
    sellingPrice: editItem?.sellingPrice?.toString() || '',
    unit: editItem?.unit || 'unidad',
    category: editItem?.category || '',
    customer: editItem?.customer?.name || '',
    status: editItem?.status || 'pending',
  });
  
  const [formData, setFormData] = useState(getInitialState());
  const [selectedItems, setSelectedItems] = useState([]);
  
  useEffect(() => {
    if (visible) {
      setFormData(getInitialState());
      setSelectedItems(editItem?.items || []);
    }
  }, [visible, editItem]);
  
  const [errors, setErrors] = useState({});
  
  const categories = ['Bebidas', 'Snacks', 'Comida', 'Postres', 'Ingredientes', 'Otros'];
  const orderStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  
  const validateForm = () => {
    const newErrors = {};
    
    if (type === 'order') {
      if (!formData.customer.trim()) {
        newErrors.customer = 'El cliente es requerido';
      }
      if (selectedItems.length === 0) {
        newErrors.items = 'Debe seleccionar al menos un producto';
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = 'El nombre es requerido';
      }
      if (!formData.quantity || isNaN(formData.quantity) || parseFloat(formData.quantity) < 0) {
        newErrors.quantity = 'La cantidad debe ser un número válido';
      }
      if (!formData.costPrice || isNaN(formData.costPrice) || parseFloat(formData.costPrice) < 0) {
        newErrors.costPrice = 'El costo debe ser un número válido';
      }
      if (!formData.sellingPrice || isNaN(formData.sellingPrice) || parseFloat(formData.sellingPrice) < 0) {
        newErrors.sellingPrice = 'El precio de venta debe ser un número válido';
      }
      if (!formData.unit) {
        newErrors.unit = 'La unidad es requerida';
      }
      if (!formData.category) {
        newErrors.category = 'La categoría es requerida';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const total = selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const itemData = type === 'inventory'
      ? {
          name: formData.name.trim(),
          quantity: parseInt(formData.quantity),
          costPrice: parseFloat(formData.costPrice),
          sellingPrice: parseFloat(formData.sellingPrice),
          unit: formData.unit.trim().toLowerCase(),
          category: formData.category
        }
      : {
          customer: { name: formData.customer.trim() },
          type: 'dine-in',
          items: selectedItems.map(i => ({ inventoryItem: i.inventoryItem, quantity: i.quantity })),
          status: formData.status,
        };
    
    onAdd(itemData);
    handleClose();
  };
  
  const handleClose = () => {
    setFormData(getInitialState());
    setSelectedItems([]);
    setErrors({});
    onClose();
  };

  const handleAddItemToOrder = (item) => {
    const existingItem = selectedItems.find(i => i.inventoryItem === item.id);
    if (existingItem) {
      return;
    }
    setSelectedItems([...selectedItems, { inventoryItem: item.id, name: item.name, quantity: 1, unitPrice: item.sellingPrice }]);
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const inventoryItem = inventory.find(i => i.id === itemId);
    if (newQuantity < 1) {
      return;
    }
    if (newQuantity > inventoryItem.quantity) {
      Alert.alert('Stock insuficiente', `Solo hay ${inventoryItem.quantity} unidades disponibles.`);
      return;
    }
    setSelectedItems(selectedItems.map(i => i.inventoryItem === itemId ? { ...i, quantity: newQuantity } : i));
  };

  const handleRemoveItemFromOrder = (itemId) => {
    setSelectedItems(selectedItems.filter(i => i.inventoryItem !== itemId));
  };
  
  const getTitle = () => {
    if (editItem) {
      return type === 'inventory' ? 'Editar Producto' : 'Editar Pedido';
    }
    return type === 'inventory' ? 'Agregar Producto' : 'Nuevo Pedido';
  };

  const sections = [
    { title: 'Productos Seleccionados', data: selectedItems, type: 'selected' },
    { title: 'Productos de Inventario', data: inventory, type: 'inventory' },
  ];

  const renderSectionHeader = ({ section: { title, data, type } }) => {
    if (type === 'selected' && data.length === 0) {
      return null;
    }
    return <Text style={styles.categoryLabel}>{title}</Text>;
  };

  const renderItem = ({ item, section }) => {
    if (section.type === 'selected') {
      return (
        <View style={styles.itemRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.inventoryItem, item.quantity - 1)}>
              <Feather name="minus-circle" size={24} color={theme.textMuted} />
            </TouchableOpacity>
            <Text style={styles.itemQuantity}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.inventoryItem, item.quantity + 1)}>
              <Feather name="plus-circle" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleRemoveItemFromOrder(item.inventoryItem)}>
            <Feather name="trash-2" size={24} color={theme.error} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.itemRow}>
        <View>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemStock}>Disponible: {item.quantity}</Text>
        </View>
        <Text style={styles.itemPrice}>{formatCurrency(item.sellingPrice)}</Text>
        <TouchableOpacity onPress={() => handleAddItemToOrder(item)} disabled={item.quantity <= 0}>
          <Feather name="plus-circle" size={24} color={item.quantity <= 0 ? theme.textMuted : theme.primary} />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Feather name="x" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{getTitle()}</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.content}>
          {type === 'inventory' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Card variant="elevated" title="Información" subtitle="Completa los datos requeridos">
                <ModernInput
                  label="Nombre del Producto"
                  placeholder="Ej: Gaseosa 350ml"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  error={errors.name}
                  icon="package"
                />
                
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <ModernInput
                      label="Cantidad"
                      placeholder="25"
                      value={formData.quantity}
                      onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                      keyboardType="numeric"
                      error={errors.quantity}
                      icon="hash"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <ModernInput
                      label="Unidad"
                      placeholder="unidad, kg, l"
                      value={formData.unit}
                      onChangeText={(text) => setFormData({ ...formData, unit: text })}
                      error={errors.unit}
                      icon="box"
                    />
                  </View>
                </View>
                
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <ModernInput
                      label="Costo Unitario"
                      placeholder="3500"
                      value={formData.costPrice}
                      onChangeText={(text) => setFormData({ ...formData, costPrice: text })}
                      keyboardType="numeric"
                      error={errors.costPrice}
                      icon="dollar-sign"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <ModernInput
                      label="Precio de Venta"
                      placeholder="5000"
                      value={formData.sellingPrice}
                      onChangeText={(text) => setFormData({ ...formData, sellingPrice: text })}
                      keyboardType="numeric"
                      error={errors.sellingPrice}
                      icon="tag"
                    />
                  </View>
                </View>
                
                <View style={styles.categoryContainer}>
                  <Text style={styles.categoryLabel}>Categoría</Text>
                  <View style={styles.categoryGrid}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          formData.category === category && styles.categoryButtonActive
                        ]}
                        onPress={() => setFormData({ ...formData, category })}
                      >
                        <Text style={[
                          styles.categoryText,
                          formData.category === category && styles.categoryTextActive
                        ]}>
                          {category}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.category && (
                    <Text style={styles.errorText}>{errors.category}</Text>
                  )}
                </View>
              </Card>
            </ScrollView>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item, index) => item.id + index}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              ListHeaderComponent={
                <>
                  <ModernInput
                    label="Cliente/Mesa"
                    placeholder="Ej: Mesa 1, Domicilio, Juan Pérez"
                    value={formData.customer}
                    onChangeText={(text) => setFormData({ ...formData, customer: text })}
                    error={errors.customer}
                    icon="user"
                  />
                  <View style={styles.statusContainer}>
                      <Text style={styles.statusLabel}>Estado</Text>
                      <View style={styles.statusGrid}>
                        {orderStatuses.map((status) => (
                          <TouchableOpacity
                            key={status}
                            style={[
                              styles.statusButton,
                              formData.status === status && styles.statusButtonActive
                            ]}
                            onPress={() => setFormData({ ...formData, status })}
                          >
                            <Text style={[
                              styles.statusText,
                              formData.status === status && styles.statusTextActive
                            ]}>
                              {status}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                </>
              }
              showsVerticalScrollIndicator={false}
            />
          )}
          
          <View style={styles.buttonContainer}>
            <ModernButton
              title="Cancelar"
              onPress={handleClose}
              variant="outline"
              size="large"
              style={styles.cancelButton}
            />
            <ModernButton
              title={editItem ? 'Actualizar' : 'Agregar'}
              onPress={handleSubmit}
              variant="gradient"
              size="large"
              icon={editItem ? 'edit' : 'plus'}
              style={styles.submitButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  categoryContainer: {
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.white,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statusTextActive: {
    color: colors.white,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 30,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemName: {
    fontSize: 16,
    color: colors.text,
  },
  itemStock: {
    fontSize: 12,
    color: colors.textMuted,
  },
  itemPrice: {
    fontSize: 14,
    color: colors.textMuted,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
