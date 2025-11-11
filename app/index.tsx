import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Truck } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { AppColors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'customer') {
        router.replace('/customer');
      } else if (user.role === 'driver') {
        if (user.isAdmin) {
          router.replace('/admin');
        } else {
          router.replace('/driver');
        }
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1565C0', '#2196F3', '#42A5F5']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Kurir Kan</Text>
          <Text style={styles.subtitle}>Pilih peran Anda untuk melanjutkan</Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => router.push('/customer/auth')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: AppColors.customer.primary }]}>
                <User size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.roleTitle}>Customer</Text>
              <Text style={styles.roleDescription}>
                Pesan layanan pengiriman dan ojek
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => router.push('/driver/auth')}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: AppColors.driver.primary }]}>
                <Truck size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.roleTitle}>Driver</Text>
              <Text style={styles.roleDescription}>
                Terima dan proses orderan
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            © 2025 Kurir Kan. All rights reserved.
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl * 2,
    paddingBottom: Spacing.xxl,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  roleContainer: {
    gap: Spacing.lg,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  roleTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600' as const,
    color: AppColors.common.black,
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
    textAlign: 'center',
  },
  footer: {
    fontSize: FontSizes.xs,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.customer.background,
  },
  loadingText: {
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
  },
});
