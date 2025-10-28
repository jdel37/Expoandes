import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../theme/colors';

export default function Card({ 
  title, 
  subtitle, 
  children, 
  onPress, 
  variant = 'default',
  gradient = false,
  style = {}
}) {
  const CardWrapper = onPress ? TouchableOpacity : View;
  
  const getCardStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.card, styles.elevatedCard, style];
      case 'outlined':
        return [styles.card, styles.outlinedCard, style];
      case 'gradient':
        return [styles.card, styles.gradientCard, style];
      default:
        return [styles.card, style];
    }
  };

  const renderContent = () => (
    <>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      <View style={styles.content}>{children}</View>
    </>
  );

  if (gradient || variant === 'gradient') {
    return (
      <CardWrapper onPress={onPress} style={[styles.cardContainer, style]}>
        <LinearGradient
          colors={colors.gradientSecondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientCard}
        >
          {renderContent()}
        </LinearGradient>
      </CardWrapper>
    );
  }

  return (
    <CardWrapper onPress={onPress} style={getCardStyle()}>
      {renderContent()}
    </CardWrapper>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  elevatedCard: {
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: colors.surfaceElevated,
  },
  outlinedCard: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  gradientCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  content: {
    marginTop: 4,
  },
});
