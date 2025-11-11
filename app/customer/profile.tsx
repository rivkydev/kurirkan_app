import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, User as UserIcon } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import { AppColors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { user, isGuest, logout } = useAuth();

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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <UserIcon size={48} color={AppColors.common.white} />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.phone}>{user?.phone || 'Guest User'}</Text>
          {isGuest && (
            <View style={styles.guestBadge}>
              <Text style={styles.guestText}>Mode Guest</Text>
            </View>
          )}
        </View>

        {isGuest && (
          <Card style={styles.card}>
            <CardContent>
              <Text style={styles.warningTitle}>Login untuk Fitur Lengkap</Text>
              <Text style={styles.warningText}>
                Daftar atau login untuk menyimpan history orderan dan menggunakan semua fitur aplikasi.
              </Text>
              <Button
                title="Login / Daftar"
                onPress={() => router.push('/customer/auth')}
                color={AppColors.customer.primary}
                style={styles.loginButton}
              />
            </CardContent>
          </Card>
        )}

        <Card style={styles.card}>
          <CardContent>
            <Text style={styles.sectionTitle}>Informasi Akun</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nama:</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>No. HP:</Text>
              <Text style={styles.infoValue}>{user?.phone || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role:</Text>
              <Text style={styles.infoValue}>Customer</Text>
            </View>
          </CardContent>
        </Card>

        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />
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
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.full,
    backgroundColor: AppColors.customer.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: '700' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
  },
  phone: {
    fontSize: FontSizes.md,
    color: AppColors.customer.textSecondary,
  },
  guestBadge: {
    backgroundColor: AppColors.driver.primaryLight,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.sm,
  },
  guestText: {
    fontSize: FontSizes.sm,
    color: AppColors.driver.primary,
    fontWeight: '600' as const,
  },
  card: {
    marginBottom: Spacing.md,
  },
  warningTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
  },
  warningText: {
    fontSize: FontSizes.md,
    color: AppColors.customer.textSecondary,
    marginBottom: Spacing.md,
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  infoLabel: {
    fontSize: FontSizes.md,
    color: AppColors.customer.textSecondary,
  },
  infoValue: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
  },
  logoutButton: {
    marginTop: Spacing.md,
  },
});
