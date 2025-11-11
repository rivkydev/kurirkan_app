import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Button from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { AppColors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { ServiceType } from '@/types';

export default function CreateOrderScreen() {
  const router = useRouter();
  const { type: serviceType = 'delivery' } = useLocalSearchParams<{ type?: ServiceType }>();
  const { user } = useAuth();
  const { createOrder } = useData();

  const [pickupAddress, setPickupAddress] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [itemDescription, setItemDescription] = useState<string>('');
  const [itemWeight, setItemWeight] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!pickupAddress || !deliveryAddress) {
      Alert.alert('Error', 'Mohon isi alamat pengambilan dan tujuan');
      return;
    }

    if (serviceType === 'delivery' && !itemDescription) {
      Alert.alert('Error', 'Mohon isi deskripsi barang');
      return;
    }

    setLoading(true);
    try {
      const orderId = await createOrder({
        customerName: user?.name || 'Guest',
        customerPhone: user?.phone || '',
        serviceType: serviceType as ServiceType,
        pickupAddress,
        deliveryAddress,
        itemDescription: serviceType === 'delivery' ? itemDescription : undefined,
        itemWeight: serviceType === 'delivery' ? itemWeight : undefined,
        notes,
        price: 15000,
        paymentMethod: 'cash',
      });

      Alert.alert('Success', 'Order berhasil dibuat', [
        {
          text: 'OK',
          onPress: () => router.replace('/customer/orders'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal membuat order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Button
            title=""
            onPress={() => router.back()}
            variant="outline"
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
          <Text style={styles.headerTitle}>
            {serviceType === 'delivery' ? 'Pengiriman Barang' : 'Ojek / Antar Jemput'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card>
            <CardContent>
              <Text style={styles.label}>Alamat Pengambilan *</Text>
              <TextInput
                style={styles.input}
                value={pickupAddress}
                onChangeText={setPickupAddress}
                placeholder="Masukkan alamat pengambilan"
                placeholderTextColor={AppColors.customer.textSecondary}
                multiline
              />

              <Text style={styles.label}>Alamat Tujuan *</Text>
              <TextInput
                style={styles.input}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                placeholder="Masukkan alamat tujuan"
                placeholderTextColor={AppColors.customer.textSecondary}
                multiline
              />

              {serviceType === 'delivery' && (
                <>
                  <Text style={styles.label}>Deskripsi Barang *</Text>
                  <TextInput
                    style={styles.input}
                    value={itemDescription}
                    onChangeText={setItemDescription}
                    placeholder="Contoh: Dokumen, Paket makanan, dll"
                    placeholderTextColor={AppColors.customer.textSecondary}
                  />

                  <Text style={styles.label}>Berat / Ukuran Barang</Text>
                  <TextInput
                    style={styles.input}
                    value={itemWeight}
                    onChangeText={setItemWeight}
                    placeholder="Contoh: 2kg, Kotak kecil"
                    placeholderTextColor={AppColors.customer.textSecondary}
                  />
                </>
              )}

              <Text style={styles.label}>Catatan Tambahan</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Catatan untuk driver (opsional)"
                placeholderTextColor={AppColors.customer.textSecondary}
                multiline
                numberOfLines={3}
              />

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Estimasi Biaya:</Text>
                <Text style={styles.priceValue}>Rp 15.000</Text>
              </View>

              <Button
                title="Buat Order"
                onPress={handleSubmit}
                loading={loading}
                color={AppColors.customer.primary}
                size="large"
              />
            </CardContent>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.customer.background,
  },
  safeArea: {
    flex: 1,
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
  backButtonText: {
    fontSize: 24,
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
  label: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.customer.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: AppColors.customer.primaryLight,
    borderRadius: BorderRadius.md,
  },
  priceLabel: {
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
    fontWeight: '600' as const,
  },
  priceValue: {
    fontSize: FontSizes.xl,
    fontWeight: '700' as const,
    color: AppColors.customer.primary,
  },
});
