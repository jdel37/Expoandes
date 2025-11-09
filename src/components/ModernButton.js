import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export default function ModernButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style = {},
  textStyle = {},
}) {
  const { theme } = useApp();
  const styles = getStyles(theme);

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    if (disabled || loading) {
      return [...baseStyle, styles.disabled, style];
    }
    
    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary, style];
      case 'secondary':
        return [...baseStyle, styles.secondary, style];
      case 'outline':
        return [...baseStyle, styles.outline, style];
      case 'ghost':
        return [...baseStyle, styles.ghost, style];
      case 'gradient':
        return [...baseStyle, styles.gradient, style];
      case 'destructive':
        return [...baseStyle, styles.destructive, style];
      default:
        return [...baseStyle, style];
    }
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    if (disabled || loading) {
      return [...baseTextStyle, styles.disabledText, textStyle];
    }
    
    switch (variant) {
      case 'primary':
      case 'gradient':
        return [...baseTextStyle, styles.primaryText, textStyle];
      case 'destructive':
        return [...baseTextStyle, styles.destructiveText, textStyle];
      case 'secondary':
        return [...baseTextStyle, styles.secondaryText, textStyle];
      case 'outline':
        return [...baseTextStyle, styles.outlineText, textStyle];
      case 'ghost':
        return [...baseTextStyle, styles.ghostText, textStyle];
      default:
        return [...baseTextStyle, textStyle];
    }
  };

  const renderContent = () => (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'gradient' ? theme.white : theme.primary} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Feather name={icon} size={16} color={getTextStyle().color || theme.white} style={styles.iconLeft} />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Feather name={icon} size={16} color={getTextStyle().color || theme.white} style={styles.iconRight} />
          )}
        </>
      )}
    </View>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.buttonContainer, style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, styles[size]]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const getStyles = (colors) => StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    minHeight: 56,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  gradient: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  disabled: {
    backgroundColor: colors.gray300,
    shadowOpacity: 0,
    elevation: 0,
  },
  
  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  primaryText: {
    color: colors.white,
  },
  destructiveText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.gray500,
  },
  
  // Icon styles
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
