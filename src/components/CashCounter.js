import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';

export default function CashCounter() {
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
          <Text style={styles.text}>${den}</Text>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            value={amounts[den].toString()}
            onChangeText={(val) => handleChange(den, val)}
          />
        </View>
      ))}
      <Text style={styles.total}>Total: ${total.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  input: { backgroundColor: '#fff', width: 70, borderRadius: 5, textAlign: 'center' },
  text: { color: colors.text },
  total: { color: colors.primary, fontSize: 18, fontWeight: 'bold', marginTop: 10 },
});
