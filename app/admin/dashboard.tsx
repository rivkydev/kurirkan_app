import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Package, TrendingUp, DollarSign, Plus } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader } from '@/components/Card';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { AppColors, Spacing, FontSizes, BorderRadius } from '@/constants/theme';
import { Driver } from '@/types';
import { generateId, hashPassword } from '@/utils/storage';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { orders, drivers, addDriver, updateDriver, deleteDriver } = useData();
  const [showAddDriver, setShowAddDriver] = useState<boolean>(false);

  const [newDriverName, setNewDriverName] = useState<string>('');
  const [newDriverPhone, setNewDriverPhone] = useState<string>('');
  const [newDriverUsername, setNewDriverUsername] = useState<string>('');
  const [newDriverPassword, setNewDriverPassword] = useState<string>('');
  const [adding, setAdding] = useState<boolean>(false);

  const onDutyDrivers = drivers.filter(d => d.status === 'on_duty');
  const busyDrivers = drivers.filter(d => d.status === 'busy');
  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const todayOrders = orders.filter(o => 
    new Date(o.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.price, 0);

  const handleAddDriver = useCallback(async () => {
    if (!newDriverName || !newDriverPhone || !newDriverUsername || !newDriverPassword) {
      Alert.alert('Error', 'Mohon isi semua field');
      return;
    }

    setAdding(true);
    try {
      const driverData: Omit<Driver, 'id' | 'createdAt' | 'lastStatusUpdate'> = {
        driverId: `DRV${Date.now().toString().slice(-6)}`,
        name: newDriverName,
        phone: newDriverPhone,
        username: newDriverUsername,
        password: hashPassword(newDriverPassword),
        role: 'driver',
        isAdmin: false,
        status: 'off_duty',
        currentOrder: null,
        todayOrders: 0,
        totalOrders: 0,
        rating: 5.0,
        earnings: 0,
      };

      await addDriver(driverData);
      
      Alert.alert('Success', `Driver ${newDriverName} berhasil ditambahkan`);
      setNewDriverName('');
      setNewDriverPhone('');
      setNewDriverUsername('');
      setNewDriverPassword('');
      setShowAddDriver(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal menambahkan driver');
    } finally {
      setAdding(false);
    }
  }, [newDriverName, newDriverPhone, newDriverUsername, newDriverPassword, addDriver]);

  const handleDeleteDriver = useCallback((driver: Driver) => {
    Alert.alert(
      'Hapus Driver',
      `Hapus driver ${driver.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            await deleteDriver(driver.id);
            Alert.alert('Success', 'Driver berhasil dihapus');
          },
        },
      ]
    );
  }, [deleteDriver]);

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
          <View>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>{user?.name}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Users size={24} color={AppColors.admin.primary} />
              <Text style={styles.statValue}>{drivers.length}</Text>
              <Text style={styles.statLabel}>Total Driver</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <TrendingUp size={24} color={AppColors.common.success} />
              <Text style={styles.statValue}>{onDutyDrivers.length}</Text>
              <Text style={styles.statLabel}>On Duty</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <Package size={24} color={AppColors.customer.primary} />
              <Text style={styles.statValue}>{activeOrders.length}</Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </CardContent>
          </Card>

          <Card style={styles.statCard}>
            <CardContent style={styles.statContent}>
              <DollarSign size={24} color={AppColors.driver.primary} />
              <Text style={styles.statValue}>
                {todayRevenue.toLocaleString('id-ID')}
              </Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </CardContent>
          </Card>
        </View>

        <Card style={styles.section}>
          <CardHeader
            title="Driver Management"
            rightElement={
              <Button
                title="Add"
                onPress={() => setShowAddDriver(!showAddDriver)}
                size="small"
                color={AppColors.admin.primary}
              />
            }
          />
          <CardContent>
            {showAddDriver && (
              <View style={styles.addDriverForm}>
                <TextInput
                  style={styles.input}
                  value={newDriverName}
                  onChangeText={setNewDriverName}
                  placeholder="Nama Driver"
                  placeholderTextColor={AppColors.customer.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  value={newDriverPhone}
                  onChangeText={setNewDriverPhone}
                  placeholder="No. HP"
                  placeholderTextColor={AppColors.customer.textSecondary}
                  keyboardType="phone-pad"
                />
                <TextInput
                  style={styles.input}
                  value={newDriverUsername}
                  onChangeText={setNewDriverUsername}
                  placeholder="Username"
                  placeholderTextColor={AppColors.customer.textSecondary}
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  value={newDriverPassword}
                  onChangeText={setNewDriverPassword}
                  placeholder="Password"
                  placeholderTextColor={AppColors.customer.textSecondary}
                  secureTextEntry
                />
                <View style={styles.formActions}>
                  <Button
                    title="Batal"
                    onPress={() => setShowAddDriver(false)}
                    variant="outline"
                    size="small"
                    style={styles.formButton}
                  />
                  <Button
                    title="Simpan"
                    onPress={handleAddDriver}
                    loading={adding}
                    size="small"
                    color={AppColors.admin.primary}
                    style={styles.formButton}
                  />
                </View>
              </View>
            )}

            {drivers.map((driver) => (
              <View key={driver.id} style={styles.driverItem}>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverDetail}>{driver.username}</Text>
                  <StatusBadge status={driver.status} style={styles.driverStatus} />
                </View>
                <View style={styles.driverActions}>
                  <Text style={styles.driverStats}>
                    {driver.totalOrders} orders
                  </Text>
                  <Button
                    title="Delete"
                    onPress={() => handleDeleteDriver(driver)}
                    variant="danger"
                    size="small"
                  />
                </View>
              </View>
            ))}
          </CardContent>
        </Card>

        <Card style={styles.section}>
          <CardHeader title="Recent Orders" />
          <CardContent>
            {orders.slice(0, 5).map((order) => (
              <View key={order.id} style={styles.orderItem}>
                <View>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderCustomer}>{order.customerName}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>
            ))}
          </CardContent>
        </Card>

        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="danger"
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
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700' as const,
    color: AppColors.customer.text,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: AppColors.customer.textSecondary,
    marginTop: Spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  statContent: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: FontSizes.xl,
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
  addDriverForm: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: AppColors.customer.background,
    borderRadius: BorderRadius.md,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.customer.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.md,
    color: AppColors.customer.text,
    marginBottom: Spacing.sm,
    backgroundColor: AppColors.common.white,
  },
  formActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  formButton: {
    flex: 1,
  },
  driverItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.customer.border,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
  },
  driverDetail: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
    marginBottom: Spacing.xs,
  },
  driverStatus: {
    marginTop: Spacing.xs,
  },
  driverActions: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  driverStats: {
    fontSize: FontSizes.xs,
    color: AppColors.customer.textSecondary,
    marginBottom: Spacing.xs,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.customer.border,
  },
  orderNumber: {
    fontSize: FontSizes.md,
    fontWeight: '600' as const,
    color: AppColors.customer.text,
    marginBottom: Spacing.xs,
  },
  orderCustomer: {
    fontSize: FontSizes.sm,
    color: AppColors.customer.textSecondary,
  },
});
