import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text } from 'react-native';
import colors from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default function Charts({ data }) {
  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <Text style={{ color: colors.primary, fontSize: 18, marginBottom: 8 }}>
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
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.background,
          backgroundGradientTo: colors.background,
          decimalPlaces: 0,
          color: (opacity = 1) => colors.primary,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary,
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
