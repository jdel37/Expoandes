import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

export default function CashCounter() {
  const { theme } = useApp();
  const styles = getStyles(theme);
  const [amounts, setAmounts] = useState({ 50000: 0, 20000: 0, 10000: 0 });
  
  const total = Object.entries(amounts).reduce(
    (acc, [denomination, count]) => acc + Number(denomination) * count,
    0
  );

  const handleChange = (denomination, value) => {
    setAmounts({ ...amounts, [denomination]: Number(value) || 0 });
  };

  return (
    <View style={styles.container}>
      {Object.keys(amounts).map((den) => (
        <View key={den} style={styles.row}>
          <Text style={styles.text}>{formatCurrency(parseInt(den))}</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={amounts[den].toString()}
            onChangeText={(val) => handleChange(den, val)}
          />
        </View>
      ))}
      <Text style={styles.total}>Total: {formatCurrency(total)}</Text>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  container: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  input: { backgroundColor: colors.surface, width: 70, borderRadius: 5, textAlign: 'center', color: colors.text },
  text: { color: colors.text },
  total: { color: colors.primary, fontSize: 18, fontWeight: 'bold', marginTop: 10 },
});
