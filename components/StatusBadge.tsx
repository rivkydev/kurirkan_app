import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { OrderStatus, DriverStatus } from '@/types';
import { AppColors, BorderRadius, FontSizes, Spacing } from '@/constants/theme';

interface StatusBadgeProps {
  status: OrderStatus | DriverStatus;
  style?: ViewStyle;
}

export default function StatusBadge({ status, style }: StatusBadgeProps) {
  const getStatusLabel = (status: OrderStatus | DriverStatus): string => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      assigned: 'Assigned',
      driver_on_way: 'Driver On Way',
      picked_up: 'Picked Up',
      in_transit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      on_duty: 'On Duty',
      off_duty: 'Off Duty',
      busy: 'Busy',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: OrderStatus | DriverStatus): string => {
    if (status in AppColors.status) {
      return AppColors.status[status as OrderStatus];
    }
    
    const driverStatusColors: Record<DriverStatus, string> = {
      on_duty: AppColors.common.success,
      off_duty: AppColors.customer.textSecondary,
      busy: AppColors.driver.primary,
    };
    
    return driverStatusColors[status as DriverStatus] || AppColors.customer.textSecondary;
  };

  const color = getStatusColor(status);

  return (
    <View style={[styles.container, { backgroundColor: color + '20' }, style]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  text: {
    fontSize: FontSizes.xs,
    fontWeight: '600' as const,
  },
});
