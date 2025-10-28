import React from 'react';
import { View, Text } from 'react-native';

export default function InventoryItem({ item }) {
  return (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
      <Text>{item.name}</Text>
      <Text>Stock: {item.quantity}</Text>
    </View>
  );
}
