import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

export default function InventoryItem({ item }) {
  const { theme } = useApp();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.stock}>Stock: {item.quantity}</Text>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  stock: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
