import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { AuthUser, Customer, Driver } from '@/types';
import { StorageService, normalizePhone, hashPassword, generateId } from '@/utils/storage';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const stored = await StorageService.getCustomers();
      console.log('Checking auth, stored customers:', stored.length);
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginCustomer = useCallback(async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedPhone = normalizePhone(phone);
      const hashedPassword = hashPassword(password);
      
      const customers = await StorageService.getCustomers();
      const customer = customers.find(c => c.phone === normalizedPhone && c.password === hashedPassword);
      
      if (!customer) {
        return { success: false, error: 'Nomor telepon atau password salah' };
      }
      
      customer.lastLogin = Date.now();
      await StorageService.saveCustomers(customers);
      
      setUser({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        role: 'customer',
      });
      setIsGuest(false);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Terjadi kesalahan saat login' };
    }
  }, []);

  const registerCustomer = useCallback(async (name: string, phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedPhone = normalizePhone(phone);
      const customers = await StorageService.getCustomers();
      
      if (customers.some(c => c.phone === normalizedPhone)) {
        return { success: false, error: 'Nomor telepon sudah terdaftar' };
      }
      
      const newCustomer: Customer = {
        id: generateId(),
        phone: normalizedPhone,
        name,
        password: hashPassword(password),
        role: 'customer',
        addresses: [],
        paymentMethods: [],
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };
      
      customers.push(newCustomer);
      await StorageService.saveCustomers(customers);
      
      setUser({
        id: newCustomer.id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        role: 'customer',
      });
      setIsGuest(false);
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Terjadi kesalahan saat mendaftar' };
    }
  }, []);

  const loginDriver = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const hashedPassword = hashPassword(password);
      const drivers = await StorageService.getDrivers();
      const driver = drivers.find(d => d.username === username && d.password === hashedPassword);
      
      if (!driver) {
        return { success: false, error: 'Username atau password salah' };
      }
      
      driver.lastStatusUpdate = Date.now();
      await StorageService.saveDrivers(drivers);
      
      setUser({
        id: driver.id,
        name: driver.name,
        phone: driver.phone,
        role: 'driver',
        isAdmin: driver.isAdmin,
      });
      setIsGuest(false);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Terjadi kesalahan saat login' };
    }
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser: AuthUser = {
      id: 'guest',
      name: 'Guest',
      phone: '',
      role: 'customer',
    };
    setUser(guestUser);
    setIsGuest(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsGuest(false);
  }, []);

  return {
    user,
    isLoading,
    isGuest,
    isAuthenticated: !!user,
    loginCustomer,
    registerCustomer,
    loginDriver,
    loginAsGuest,
    logout,
  };
});
