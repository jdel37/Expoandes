import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

export default function LoadingSpinner({ 
  size = 'large', 
  color = colors.primary, 
  text, 
  overlay = false,
  style = {} 
}) {
  const content = (
    <View style={[styles.container, overlay && styles.overlay, style]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <View style={StyleSheet.absoluteFillObject}>
        <LinearGradient
          colors={[colors.background + '90', colors.backgroundSecondary + '90']}
          style={StyleSheet.absoluteFillObject}
        />
        {content}
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
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
