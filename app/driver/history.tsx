import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import { AppColors, Spacing, FontSizes } from '@/constants/theme';

export default function DriverHistoryScreen() {
  const { user } = useAuth();
  const { orders } = useData();

  const myOrders = orders.filter(o => o.driverId === user?.id);
  const completedOrders = myOrders.filter(o => 
    ['delivered', 'cancelled'].includes(o.status)
  ).sort((a, b) => (b.deliveredAt || b.cancelledAt || 0) - (a.deliveredAt || a.cancelledAt || 0));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>{completedOrders.length} orderan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {completedOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Belum ada history orderan</Text>
          </View>
        ) : (
          completedOrders.map(order => (
            <Card key={order.id} style={styles.orderCard}>
              <CardContent>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <StatusBadge status={order.status} />
                </View>
                <Text style={styles.customerName}>Customer: {order.customerName}</Text>
                <Text style={styles.address}>{order.pickupAddress} → {order.deliveryAddress}</Text>
                <Text style={styles.date}>
                  {new Date(order.deliveredAt || order.cancelledAt || order.createdAt).toLocaleDateString('id-ID')}
                </Text>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.customer.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: AppColors.common.white,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700' as const,
    color: AppColors.customer.text,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: AppColors.customer.textSecondary,
    marginTop: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: AppColors.customer.textSecondary,
  },
  orderCard: {
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderNumber: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  customerName: {
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
  },
  address: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
  },
});
