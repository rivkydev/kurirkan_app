import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Power, PowerOff, Package, DollarSign, Star } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { AppColors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';
import { DriverStatus } from '@/types';

export default function DriverDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { orders, drivers, updateDriver } = useData();
  
  const driver = drivers.find(d => d.id === user?.id);
  const [isOnDuty, setIsOnDuty] = useState<boolean>(driver?.status === 'on_duty');

  const myOrders = orders.filter(o => o.driverId === user?.id);
  const activeOrder = myOrders.find(o => !['delivered', 'cancelled'].includes(o.status));
  const todayCompleted = myOrders.filter(o => 
    o.status === 'delivered' && 
    new Date(o.deliveredAt || 0).toDateString() === new Date().toDateString()
  );

  const handleToggleDuty = async () => {
    const newStatus: DriverStatus = isOnDuty ? 'off_duty' : 'on_duty';
    await updateDriver(user?.id || '', { status: newStatus });
    setIsOnDuty(!isOnDuty);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  if (!driver) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Halo,</Text>
            <Text style={styles.driverName}>{driver.name}!</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.dutyButton,
              { backgroundColor: isOnDuty ? AppColors.common.success : AppColors.customer.textSecondary }
            ]}
            onPress={handleToggleDuty}
            activeOpacity={0.8}
          >
            {isOnDuty ? (
              <Power size={24} color="#FFFFFF" />
            ) : (
              <PowerOff size={24} color="#FFFFFF" />
            )}
            <Text style={styles.dutyText}>
              {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Package size={24} color={AppColors.driver.primary} />
              <Text style={styles.statValue}>{todayCompleted.length}</Text>
              <Text style={styles.statLabel}>Hari Ini</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <DollarSign size={24} color={AppColors.common.success} />
              <Text style={styles.statValue}>
                {(todayCompleted.length * 10000).toLocaleString('id-ID')}
              </Text>
              <Text style={styles.statLabel}>Penghasilan</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Star size={24} color={AppColors.common.warning} />
              <Text style={styles.statValue}>{driver.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </CardContent>
          </Card>
        </View>

        {activeOrder ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Orderan Aktif</Text>
            <Card
              style={styles.orderCard}
              onPress={() => router.push(`/driver/order-detail?id=${activeOrder.id}`)}
            >
              <CardContent>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderNumber}>{activeOrder.orderNumber}</Text>
                  <StatusBadge status={activeOrder.status} />
                </View>
                <Text style={styles.label}>Pengambilan:</Text>
                <Text style={styles.address}>{activeOrder.pickupAddress}</Text>
                <Text style={styles.label}>Tujuan:</Text>
                <Text style={styles.address}>{activeOrder.deliveryAddress}</Text>
                <Button
                  title="Lihat Detail"
                  onPress={() => router.push(`/driver/order-detail?id=${activeOrder.id}`)}
                  color={AppColors.driver.primary}
                  style={styles.detailButton}
                />
              </CardContent>
            </Card>
          </View>
        ) : (
          <View style={styles.section}>
            <Card>
              <CardContent style={styles.emptyOrderContent}>
                <Package size={48} color={AppColors.customer.textSecondary} />
                <Text style={styles.emptyOrderText}>
                  {isOnDuty ? 'Menunggu orderan baru...' : 'Aktifkan status untuk menerima orderan'}
                </Text>
              </CardContent>
            </Card>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Button
            title="Lihat History"
            onPress={() => router.push('/driver/history')}
            variant="outline"
            color={AppColors.driver.primary}
            style={styles.actionButton}
          />
          {user?.isAdmin && (
            <Button
              title="Admin Panel"
              onPress={() => router.replace('/admin')}
              color={AppColors.admin.primary}
              style={styles.actionButton}
            />
          )}
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.customer.background,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: FontSizes.lg,
    color: AppColors.customer.textSecondary,
  },
  driverName: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700' as const,
    color: AppColors.customer.text,
  },
  dutyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  dutyText: {
    fontSize: FontSizes.sm,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700' as const,
    color: AppColors.customer.text,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: AppColors.customer.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.md,
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
  detailButton: {
    marginTop: Spacing.md,
  },
  emptyOrderContent: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptyOrderText: {
    fontSize: FontSizes.md,
    color: AppColors.customer.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});
