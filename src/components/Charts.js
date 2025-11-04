import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text } from 'react-native';
import { useApp } from '../context/AppContext';

const screenWidth = Dimensions.get('window').width;

export default function Charts({ data }) {
  const { theme } = useApp();

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ color: theme.primary, fontSize: 18, marginBottom: 8 }}>
        Tendencia de Ventas
      </Text>
      <LineChart
        data={{
          labels: data?.labels || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [
            {
              data: data?.values || [100, 200, 150, 300, 250, 400],
            },
          ],
        }}
        width={screenWidth * 0.9}
        height={220}
        yAxisSuffix="k"
        chartConfig={{
          backgroundColor: theme.background,
          backgroundGradientFrom: theme.background,
          backgroundGradientTo: theme.background,
          decimalPlaces: 0,
          color: (opacity = 1) => theme.primary,
          labelColor: (opacity = 1) => theme.text,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: theme.primary,
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}
