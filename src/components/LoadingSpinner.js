import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';

export default function LoadingSpinner({ 
  size = 'large', 
  color,
  text, 
  overlay = false,
  style = {} 
}) {
  const { theme } = useApp();
  const styles = getStyles(theme);
  const spinnerColor = color || theme.primary;

  const content = (
    <View style={[styles.container, overlay && styles.overlay, style]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size={size} color={spinnerColor} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={[theme.background + '90', theme.backgroundSecondary + '90']}
          style={StyleSheet.absoluteFillObject}
        />
        {content}
      </View>
    );
  }

  return content;
}

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  spinnerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
