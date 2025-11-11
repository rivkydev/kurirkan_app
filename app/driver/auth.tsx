import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import { useAuth } from '@/contexts/AuthContext';
import { AppColors, Spacing, BorderRadius, FontSizes } from '@/constants/theme';

export default function DriverAuthScreen() {
  const router = useRouter();
  const { loginDriver } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Mohon isi username dan password');
      return;
    }

    setLoading(true);
    try {
      const result = await loginDriver(username, password);

      if (result.success) {
        router.replace('/driver');
      } else {
        Alert.alert('Error', result.error || 'Terjadi kesalahan');
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F57C00', '#FF9800']} style={styles.gradient}>
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
                <Text style={styles.subtitle}>Driver</Text>
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.infoText}>
                  Login dengan kredensial yang diberikan oleh admin
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Masukkan username"
                    placeholderTextColor={AppColors.customer.textSecondary}
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
                  title="Login"
                  onPress={handleSubmit}
                  loading={loading}
                  style={styles.submitButton}
                  color={AppColors.driver.primary}
                />

                <Button
                  title="Kembali"
                  onPress={() => router.back()}
                  variant="outline"
                  style={styles.backButton}
                  color={AppColors.driver.primary}
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
  infoText: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
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
  backButton: {
    marginTop: Spacing.sm,
  },
});
