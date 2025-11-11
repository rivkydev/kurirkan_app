import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { AppColors, BorderRadius, FontSizes, Shadows, Spacing } from '@/constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
}

export function Card({ children, style, onPress, disabled }: CardProps) {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[styles.card, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Component>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

export function CardHeader({ title, subtitle, rightElement, style, titleStyle }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.headerTextContainer}>
        <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement}
    </View>
  );
}

interface CardContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.common.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.customer.border,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
    marginTop: Spacing.xs,
  },
  content: {
    padding: Spacing.md,
  },
});
