import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package, Bike, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent } from '@/components/Card';
import { AppColors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const { orders } = useData();

  useEffect(() => {
    if (!user) {
      router.replace('/customer/auth');
    }
  }, [user]);

  const myOrders = orders.filter(o => o.customerId === user?.id);
  const activeOrders = myOrders.filter(o => 
    !['delivered', 'cancelled'].includes(o.status)
  );
  const completedOrders = myOrders.filter(o => o.status === 'delivered');

  const handleCreateOrder = (type: 'delivery' | 'ride') => {
    if (isGuest) {
      Alert.alert(
        'Login Required',
        'Anda perlu login untuk membuat orderan. Ingin login sekarang?',
        [
          { text: 'Nanti', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/customer/auth') },
        ]
      );
      return;
    }
    router.push(`/customer/create-order?type=${type}`);
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.userName}>{user.name}!</Text>
          {isGuest && (
            <Text style={styles.guestBadge}>Mode Guest</Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Package size={24} color={AppColors.customer.primary} />
              <Text style={styles.statValue}>{activeOrders.length}</Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <TrendingUp size={24} color={AppColors.common.success} />
              <Text style={styles.statValue}>{completedOrders.length}</Text>
              <Text style={styles.statLabel}>Selesai</Text>
            </CardContent>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layanan Kami</Text>

          <TouchableOpacity
            style={[styles.serviceCard, { backgroundColor: AppColors.customer.primaryLight }]}
            onPress={() => handleCreateOrder('delivery')}
            activeOpacity={0.8}
          >
            <Package size={48} color={AppColors.customer.primary} />
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceTitle}>Pengiriman Barang</Text>
              <Text style={styles.serviceDescription}>
                Kirim paket, dokumen, atau barang lainnya dengan aman
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.serviceCard, { backgroundColor: AppColors.driver.primaryLight }]}
            onPress={() => handleCreateOrder('ride')}
            activeOpacity={0.8}
          >
            <Bike size={48} color={AppColors.driver.primary} />
            <View style={styles.serviceTextContainer}>
              <Text style={styles.serviceTitle}>Ojek / Antar Jemput</Text>
              <Text style={styles.serviceDescription}>
                Layanan transportasi online untuk perjalanan Anda
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {activeOrders.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Orderan Aktif</Text>
              <TouchableOpacity onPress={() => router.push('/customer/orders')}>
                <Text style={styles.seeAll}>Lihat Semua</Text>
              </TouchableOpacity>
            </View>

            {activeOrders.slice(0, 3).map(order => (
              <Card
                key={order.id}
                style={styles.orderCard}
                onPress={() => router.push(`/customer/order-detail?id=${order.id}`)}
              >
                <CardContent>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: AppColors.status[order.status] + '20' }]}>
                      <Text style={[styles.statusText, { color: AppColors.status[order.status] }]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderAddress} numberOfLines={1}>
                    {order.pickupAddress} → {order.deliveryAddress}
                  </Text>
                </CardContent>
              </Card>
            ))}
          </View>
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
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: FontSizes.lg,
    color: AppColors.customer.textSecondary,
  },
  userName: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700' as const,
    color: AppColors.customer.text,
  },
  guestBadge: {
    fontSize: FontSizes.sm,
    color: AppColors.driver.primary,
    marginTop: Spacing.xs,
    fontWeight: '600' as const,
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
    fontSize: FontSizes.xxl,
    fontWeight: '700' as const,
    color: AppColors.customer.text,
  },
  statLabel: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  seeAll: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.primary,
    fontWeight: '600' as const,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  serviceTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  serviceTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
  },
  serviceDescription: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
  },
  orderCard: {
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  orderNumber: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  statusBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: '600' as const,
  },
  orderAddress: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
  },
});
