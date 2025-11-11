import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { AppColors, Spacing, FontSizes } from '@/constants/theme';

export default function DriverOrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, updateOrderStatus } = useData();

  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <View style={styles.container}>
        <Text>Order not found</Text>
      </View>
    );
  }

  const handlePickup = async () => {
    await updateOrderStatus(order.id, 'picked_up', 'Driver picked up the order');
    Alert.alert('Success', 'Barang telah diambil');
  };

  const handleComplete = async () => {
    Alert.alert(
      'Selesaikan Order',
      'Apakah barang sudah diterima customer?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Selesai',
          onPress: async () => {
            await updateOrderStatus(order.id, 'delivered', 'Order completed');
            Alert.alert('Success', 'Order selesai', [
              { text: 'OK', onPress: () => router.replace('/driver/dashboard') },
            ]);
          },
        },
      ]
    );
  };

  const handleCancel = async () => {
    Alert.alert(
      'Batalkan Order',
      'Yakin ingin membatalkan order ini?',
      [
        { text: 'Tidak', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            await updateOrderStatus(order.id, 'cancelled', 'Cancelled by driver');
            router.replace('/driver/dashboard');
          },
        },
      ]
    );
  };

  const canPickup = order.status === 'assigned' || order.status === 'driver_on_way';
  const canComplete = order.status === 'picked_up' || order.status === 'in_transit';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Button
          title="←"
          onPress={() => router.back()}
          variant="outline"
          size="small"
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Order Detail</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <CardHeader
            title={order.orderNumber}
            rightElement={<StatusBadge status={order.status} />}
          />
          <CardContent>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Customer:</Text>
              <Text style={styles.value}>{order.customerName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>No. HP:</Text>
              <Text style={styles.value}>{order.customerPhone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Tipe:</Text>
              <Text style={styles.value}>
                {order.serviceType === 'delivery' ? 'Pengiriman Barang' : 'Ojek'}
              </Text>
            </View>
          </CardContent>
        </Card>

        <Card style={styles.card}>
          <CardHeader title="Alamat" />
          <CardContent>
            <Text style={styles.label}>Pengambilan:</Text>
            <Text style={styles.address}>{order.pickupAddress}</Text>

            <Text style={[styles.label, styles.labelSpacing]}>Tujuan:</Text>
            <Text style={styles.address}>{order.deliveryAddress}</Text>
          </CardContent>
        </Card>

        {order.itemDescription && (
          <Card style={styles.card}>
            <CardHeader title="Detail Barang" />
            <CardContent>
              <View style={styles.infoRow}>
                <Text style={styles.label}>Deskripsi:</Text>
                <Text style={styles.value}>{order.itemDescription}</Text>
              </View>
              {order.itemWeight && (
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Berat:</Text>
                  <Text style={styles.value}>{order.itemWeight}</Text>
                </View>
              )}
            </CardContent>
          </Card>
        )}

        {order.notes && (
          <Card style={styles.card}>
            <CardHeader title="Catatan" />
            <CardContent>
              <Text style={styles.notes}>{order.notes}</Text>
            </CardContent>
          </Card>
        )}

        <Card style={styles.card}>
          <CardHeader title="Timeline" />
          <CardContent>
            {order.timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStatus}>{item.status}</Text>
                  <Text style={styles.timelineDate}>
                    {new Date(item.timestamp).toLocaleString('id-ID')}
                  </Text>
                  {item.note && (
                    <Text style={styles.timelineNote}>{item.note}</Text>
                  )}
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <View style={styles.actions}>
            {canPickup && (
              <Button
                title="Barang Diambil"
                onPress={handlePickup}
                color={AppColors.driver.primary}
                size="large"
                style={styles.actionButton}
              />
            )}
            {canComplete && (
              <Button
                title="Selesai"
                onPress={handleComplete}
                color={AppColors.common.success}
                size="large"
                style={styles.actionButton}
              />
            )}
            <Button
              title="Batalkan"
              onPress={handleCancel}
              variant="danger"
              size="large"
              style={styles.actionButton}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: AppColors.common.white,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.customer.border,
  },
  backButton: {
    width: 40,
    paddingHorizontal: 0,
  },
  headerTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  card: {
    marginTop: Spacing.md,
  },
  infoRow: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
    marginBottom: Spacing.xs,
  },
  labelSpacing: {
    marginTop: Spacing.md,
  },
  value: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  address: {
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
    lineHeight: 22,
  },
  notes: {
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
    fontStyle: 'italic' as const,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppColors.customer.primary,
    marginTop: 4,
    marginRight: Spacing.md,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStatus: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
  },
  timelineNote: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
    fontStyle: 'italic' as const,
    marginTop: Spacing.xs,
  },
  actions: {
    marginTop: Spacing.lg,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
});
