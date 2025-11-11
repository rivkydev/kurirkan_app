import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, Driver, Order, QueueItem, AppSettings, Notification } from '@/types';

const STORAGE_KEYS = {
  CUSTOMERS: '@kurirkan/customers',
  DRIVERS: '@kurirkan/drivers',
  ORDERS: '@kurirkan/orders',
  QUEUE: '@kurirkan/queue',
  SETTINGS: '@kurirkan/settings',
  NOTIFICATIONS: '@kurirkan/notifications',
  LAST_BACKUP: '@kurirkan/last_backup',
};

export const StorageService = {
  async getCustomers(): Promise<Customer[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading customers:', error);
      return [];
    }
  },

  async saveCustomers(customers: Customer[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (error) {
      console.error('Error saving customers:', error);
      throw error;
    }
  },

  async getDrivers(): Promise<Driver[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DRIVERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading drivers:', error);
      return [];
    }
  },

  async saveDrivers(drivers: Driver[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
    } catch (error) {
      console.error('Error saving drivers:', error);
      throw error;
    }
  },

  async getOrders(): Promise<Order[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  },

  async saveOrders(orders: Order[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
      throw error;
    }
  },

  async getQueue(): Promise<QueueItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading queue:', error);
      return [];
    }
  },

  async saveQueue(queue: QueueItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving queue:', error);
      throw error;
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
      const defaultSettings: AppSettings = {
        orderTimeoutDuration: 60,
        queueCheckInterval: 5,
        autoCleanupDays: 30,
        operatingHours: {
          start: '06:00',
          end: '22:00',
        },
      };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
      return defaultSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        orderTimeoutDuration: 60,
        queueCheckInterval: 5,
        autoCleanupDays: 30,
        operatingHours: {
          start: '06:00',
          end: '22:00',
        },
      };
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async getNotifications(): Promise<Notification[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  },

  async saveNotifications(notifications: Notification[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
      throw error;
    }
  },

  async createBackup(): Promise<void> {
    try {
      const [customers, drivers, orders, queue, settings, notifications] = await Promise.all([
        this.getCustomers(),
        this.getDrivers(),
        this.getOrders(),
        this.getQueue(),
        this.getSettings(),
        this.getNotifications(),
      ]);

      const backup = {
        timestamp: Date.now(),
        data: {
          customers,
          drivers,
          orders,
          queue,
          settings,
          notifications,
        },
      };

      await AsyncStorage.setItem(STORAGE_KEYS.LAST_BACKUP, JSON.stringify(backup));
      console.log('Backup created successfully');
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const generateOrderNumber = (): string => {
  const prefix = 'KK';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

export const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

export const normalizePhone = (phone: string): string => {
  phone = phone.replace(/\D/g, '');
  
  if (phone.startsWith('0')) {
    phone = '62' + phone.slice(1);
  } else if (!phone.startsWith('62')) {
    phone = '62' + phone;
  }
  
  return phone;
};
