import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Card from './Card';
import ModernInput from './ModernInput';
import ModernButton from './ModernButton';
import colors from '../theme/colors';
import { Feather } from '@expo/vector-icons';

export default function AddItemModal({ 
  visible, 
  onClose, 
  onAdd, 
  type = 'inventory',
  editItem = null 
}) {
  const getInitialState = () => ({
    name: editItem?.name || '',
    quantity: editItem?.quantity?.toString() || '',
    costPrice: editItem?.costPrice?.toString() || '',
    sellingPrice: editItem?.sellingPrice?.toString() || '',
    unit: editItem?.unit || 'unidad',
    category: editItem?.category || '',
    customer: editItem?.customer || '',
    total: editItem?.total?.toString() || '',
    status: editItem?.status || 'Pendiente',
    items: editItem?.items?.toString() || '',
  });

  const [formData, setFormData] = useState(getInitialState());

  useEffect(() => {
    if (visible) {
      setFormData(getInitialState());
    }
  }, [visible, editItem]);

  const [errors, setErrors] = useState({});

  const categories = ['Bebidas', 'Snacks', 'Comida', 'Postres', 'Ingredientes', 'Otros'];
  const orderStatuses = ['Pendiente', 'En Proceso', 'Entregado', 'Cancelado'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (type === 'inventory') {
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
    } else if (type === 'order') {
      if (!formData.customer.trim()) {
        newErrors.customer = 'El cliente es requerido';
      }
      if (!formData.total || isNaN(formData.total) || parseFloat(formData.total) < 0) {
        newErrors.total = 'El total debe ser un número válido';
      }
      if (!formData.items || isNaN(formData.items) || parseFloat(formData.items) < 1) {
        newErrors.items = 'La cantidad de productos debe ser al menos 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

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
          customer: formData.customer.trim(),
          total: parseFloat(formData.total),
          status: formData.status,
          items: parseInt(formData.items),
          time: new Date().toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        };

    onAdd(itemData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      quantity: '',
      costPrice: '',
      sellingPrice: '',
      unit: 'unidad',
      category: '',
      customer: '',
      total: '',
      status: 'Pendiente',
      items: '',
    });
    setErrors({});
    onClose();
  };

  const getTitle = () => {
    if (editItem) {
      return type === 'inventory' ? 'Editar Producto' : 'Editar Pedido';
    }
    return type === 'inventory' ? 'Agregar Producto' : 'Nuevo Pedido';
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
            <Feather name="x" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{getTitle()}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Card variant="elevated" title="Información" subtitle="Completa los datos requeridos">
            {type === 'inventory' ? (
              <>
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
              </>
            ) : (
              <>
                <ModernInput
                  label="Cliente/Mesa"
                  placeholder="Ej: Mesa 1, Domicilio, Juan Pérez"
                  value={formData.customer}
                  onChangeText={(text) => setFormData({ ...formData, customer: text })}
                  error={errors.customer}
                  icon="user"
                />

                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <ModernInput
                      label="Total"
                      placeholder="25000"
                      value={formData.total}
                      onChangeText={(text) => setFormData({ ...formData, total: text })}
                      keyboardType="numeric"
                      error={errors.total}
                      icon="dollar-sign"
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <ModernInput
                      label="Productos"
                      placeholder="3"
                      value={formData.items}
                      onChangeText={(text) => setFormData({ ...formData, items: text })}
                      keyboardType="numeric"
                      error={errors.items}
                      icon="shopping-cart"
                    />
                  </View>
                </View>

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
            )}
          </Card>

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
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});
