import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import { AppColors, Spacing, FontSizes } from '@/constants/theme';

export default function CustomerOrdersScreen() {
  const { user } = useAuth();
  const { orders } = useData();

  const myOrders = orders.filter(o => o.customerId === user?.id);
  const activeOrders = myOrders.filter(o => 
    !['delivered', 'cancelled'].includes(o.status)
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Orderan Aktif</Text>
        <Text style={styles.subtitle}>{activeOrders.length} orderan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Tidak ada orderan aktif</Text>
          </View>
        ) : (
          activeOrders.map(order => (
            <Card key={order.id} style={styles.orderCard}>
              <CardContent>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <StatusBadge status={order.status} />
                </View>
                <Text style={styles.label}>Pengambilan:</Text>
                <Text style={styles.address}>{order.pickupAddress}</Text>
                <Text style={styles.label}>Tujuan:</Text>
                <Text style={styles.address}>{order.deliveryAddress}</Text>
                {order.driverName && (
                  <>
                    <Text style={styles.label}>Driver:</Text>
                    <Text style={styles.driverName}>{order.driverName}</Text>
                  </>
                )}
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
    marginBottom: Spacing.md,
  },
  orderNumber: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  label: {
    fontSize: FontSizes.xs,
    color: AppColors.customer.textSecondary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  address: {
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
  },
  driverName: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.primary,
  },
});
