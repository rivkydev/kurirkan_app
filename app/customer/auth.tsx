import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { AppColors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

export default function CustomerAuthScreen() {
  const router = useRouter();
  const { loginCustomer, registerCustomer, loginAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!phone || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await loginCustomer(phone, password);
      } else {
        result = await registerCustomer(name, phone, password);
      }

      if (result.success) {
        router.replace('/customer');
      } else {
        Alert.alert('Error', result.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    router.replace('/customer');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1565C0', '#2196F3']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Kurir Kan</Text>
                <Text style={styles.subtitle}>Customer</Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.tabContainer}>
                  <Button
                    title="Login"
                    onPress={() => setIsLogin(true)}
                    variant={isLogin ? 'primary' : 'outline'}
                    style={styles.tabButton}
                    color={AppColors.customer.primary}
                  />
                  <Button
                    title="Daftar"
                    onPress={() => setIsLogin(false)}
                    variant={!isLogin ? 'primary' : 'outline'}
                    style={styles.tabButton}
                    color={AppColors.customer.primary}
                  />
                </View>

                {!isLogin && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nama</Text>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Masukkan nama lengkap"
                      placeholderTextColor={AppColors.customer.textSecondary}
                      autoCapitalize="words"
                    />
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nomor HP</Text>
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="08xx xxxx xxxx"
                    placeholderTextColor={AppColors.customer.textSecondary}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Masukkan password"
                    placeholderTextColor={AppColors.customer.textSecondary}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>

                <Button
                  title={isLogin ? 'Login' : 'Daftar'}
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.submitButton}
                  color={AppColors.customer.primary}
                />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>atau</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  title="Lanjutkan sebagai Guest"
                  onPress={handleGuestLogin}
                  variant="outline"
                  style={styles.guestButton}
                  color={AppColors.customer.primary}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.xl,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  tabButton: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
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
  submitButton: {
    marginTop: Spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: AppColors.customer.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
  },
  guestButton: {
    borderColor: AppColors.customer.primary,
  },
});
