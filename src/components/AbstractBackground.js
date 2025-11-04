import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

export default function AbstractBackground({ children, variant = 'default' }) {
  const { theme } = useApp();

  const renderAbstractShapes = () => {
    if (variant === 'login') {
      return (
        <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
          <Defs>
            <SvgLinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.primaryLight} stopOpacity="0.1" />
              <Stop offset="100%" stopColor={theme.primary} stopOpacity="0.05" />
            </SvgLinearGradient>
            <SvgLinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.accent} stopOpacity="0.08" />
              <Stop offset="100%" stopColor={theme.accentLight} stopOpacity="0.03" />
            </SvgLinearGradient>
          </Defs>
          
          {/* Large organic shapes */}
          <Path
            d={`M0,${height * 0.2} Q${width * 0.3},${height * 0.1} ${width * 0.6},${height * 0.25} T${width},${height * 0.2} L${width},0 L0,0 Z`}
            fill="url(#grad1)"
          />
          <Path
            d={`M0,${height * 0.8} Q${width * 0.4},${height * 0.9} ${width * 0.7},${height * 0.75} T${width},${height * 0.8} L${width},${height} L0,${height} Z`}
            fill="url(#grad2)"
          />
          
          {/* Floating circles */}
          <Circle cx={width * 0.15} cy={height * 0.3} r="40" fill={theme.primary} opacity="0.1" />
          <Circle cx={width * 0.85} cy={height * 0.7} r="60" fill={theme.accent} opacity="0.08" />
          <Circle cx={width * 0.7} cy={height * 0.2} r="25" fill={theme.secondary} opacity="0.12" />
        </Svg>
      );
    }

    return (
      <Svg height={height} width={width} style={StyleSheet.absoluteFillObject}>
        <Defs>
          <SvgLinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.primaryLight} stopOpacity="0.15" />
            <Stop offset="100%" stopColor={theme.primary} stopOpacity="0.08" />
          </SvgLinearGradient>
          <SvgLinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.accent} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={theme.accentLight} stopOpacity="0.05" />
          </SvgLinearGradient>
        </Defs>
        
        {/* Modern geometric shapes */}
        <Path
          d={`M0,${height * 0.15} Q${width * 0.25},${height * 0.05} ${width * 0.5},${height * 0.15} T${width},${height * 0.1} L${width},0 L0,0 Z`}
          fill="url(#grad1)"
        />
        <Path
          d={`M0,${height * 0.85} Q${width * 0.3},${height * 0.95} ${width * 0.6},${height * 0.85} T${width},${height * 0.9} L${width},${height} L0,${height} Z`}
          fill="url(#grad2)"
        />
        
        {/* Abstract floating elements */}
        <Circle cx={width * 0.1} cy={height * 0.25} r="35" fill={theme.primary} opacity="0.12" />
        <Circle cx={width * 0.9} cy={height * 0.75} r="50" fill={theme.accent} opacity="0.1" />
        <Circle cx={width * 0.8} cy={height * 0.15} r="30" fill={theme.secondary} opacity="0.15" />
        <Circle cx={width * 0.2} cy={height * 0.8} r="40" fill={theme.primaryLight} opacity="0.08" />
      </Svg>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={theme.gradientSurface}
        style={StyleSheet.absoluteFillObject}
      />
      {renderAbstractShapes()}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
