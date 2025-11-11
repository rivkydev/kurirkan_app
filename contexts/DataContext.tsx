import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { Order, Driver, QueueItem, Notification, OrderStatus, DriverStatus } from '@/types';
import { StorageService, generateId, generateOrderNumber } from '@/utils/storage';
import { useAuth } from './AuthContext';

export const [DataProvider, useData] = createContextHook(() => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
    
    const autoSaveInterval = setInterval(() => {
      saveAllData();
    }, 5 * 60 * 1000);

    return () => clearInterval(autoSaveInterval);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedOrders, loadedDrivers, loadedQueue, loadedNotifications] = await Promise.all([
        StorageService.getOrders(),
        StorageService.getDrivers(),
        StorageService.getQueue(),
        StorageService.getNotifications(),
      ]);
      
      setOrders(loadedOrders);
      setDrivers(loadedDrivers);
      setQueue(loadedQueue);
      setNotifications(loadedNotifications);
      
      console.log('Data loaded:', { 
        orders: loadedOrders.length, 
        drivers: loadedDrivers.length,
        queue: loadedQueue.length 
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllData = useCallback(async () => {
    try {
      await Promise.all([
        StorageService.saveOrders(orders),
        StorageService.saveDrivers(drivers),
        StorageService.saveQueue(queue),
        StorageService.saveNotifications(notifications),
      ]);
      console.log('Data auto-saved');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [orders, drivers, queue, notifications]);

  const createOrder = useCallback(async (orderData: Partial<Order>): Promise<string> => {
    const newOrder: Order = {
      id: generateId(),
      orderNumber: generateOrderNumber(),
      customerId: user?.id || 'guest',
      customerName: orderData.customerName || user?.name || 'Guest',
      customerPhone: orderData.customerPhone || user?.phone || '',
      driverId: null,
      driverName: null,
      serviceType: orderData.serviceType || 'delivery',
      status: 'pending',
      pickupAddress: orderData.pickupAddress || '',
      deliveryAddress: orderData.deliveryAddress || '',
      pickupLat: orderData.pickupLat,
      pickupLng: orderData.pickupLng,
      deliveryLat: orderData.deliveryLat,
      deliveryLng: orderData.deliveryLng,
      itemDescription: orderData.itemDescription,
      itemWeight: orderData.itemWeight,
      itemValue: orderData.itemValue,
      distance: orderData.distance,
      price: orderData.price || 0,
      paymentMethod: orderData.paymentMethod || 'cash',
      notes: orderData.notes,
      createdAt: Date.now(),
      assignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
      cancelledAt: null,
      timeline: [
        {
          status: 'pending',
          timestamp: Date.now(),
          note: 'Order created',
        },
      ],
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    await StorageService.saveOrders(updatedOrders);

    const queueItem: QueueItem = {
      orderId: newOrder.id,
      priority: 1,
      addedAt: Date.now(),
    };
    const updatedQueue = [...queue, queueItem];
    setQueue(updatedQueue);
    await StorageService.saveQueue(updatedQueue);

    addNotification({
      userId: user?.id || 'guest',
      title: 'Order Created',
      message: `Order ${newOrder.orderNumber} has been created`,
      type: 'order_update',
      orderId: newOrder.id,
    });

    console.log('Order created:', newOrder.id);
    return newOrder.id;
  }, [user, orders, queue]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus, note?: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const timeline = [
          ...order.timeline,
          {
            status,
            timestamp: Date.now(),
            note,
          },
        ];

        const updates: Partial<Order> = {
          status,
          timeline,
        };

        if (status === 'assigned' && !order.assignedAt) {
          updates.assignedAt = Date.now();
        } else if (status === 'picked_up' && !order.pickedUpAt) {
          updates.pickedUpAt = Date.now();
        } else if (status === 'delivered' && !order.deliveredAt) {
          updates.deliveredAt = Date.now();
        } else if (status === 'cancelled' && !order.cancelledAt) {
          updates.cancelledAt = Date.now();
        }

        return { ...order, ...updates };
      }
      return order;
    });

    setOrders(updatedOrders);
    await StorageService.saveOrders(updatedOrders);

    const order = updatedOrders.find(o => o.id === orderId);
    if (order) {
      addNotification({
        userId: order.customerId,
        title: 'Order Updated',
        message: `Order ${order.orderNumber} is now ${status}`,
        type: 'order_update',
        orderId: order.id,
      });
    }

    console.log('Order status updated:', orderId, status);
  }, [orders]);

  const assignOrderToDriver = useCallback(async (orderId: string, driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) return;

    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          driverId: driver.id,
          driverName: driver.name,
          status: 'assigned' as OrderStatus,
          assignedAt: Date.now(),
          timeline: [
            ...order.timeline,
            {
              status: 'assigned' as OrderStatus,
              timestamp: Date.now(),
              note: `Assigned to driver ${driver.name}`,
            },
          ],
        };
      }
      return order;
    });

    const updatedDrivers = drivers.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          currentOrder: orderId,
          status: 'busy' as DriverStatus,
          todayOrders: d.todayOrders + 1,
          totalOrders: d.totalOrders + 1,
        };
      }
      return d;
    });

    const updatedQueue = queue.filter(q => q.orderId !== orderId);

    setOrders(updatedOrders);
    setDrivers(updatedDrivers);
    setQueue(updatedQueue);

    await Promise.all([
      StorageService.saveOrders(updatedOrders),
      StorageService.saveDrivers(updatedDrivers),
      StorageService.saveQueue(updatedQueue),
    ]);

    const order = updatedOrders.find(o => o.id === orderId);
    if (order) {
      addNotification({
        userId: order.customerId,
        title: 'Driver Assigned',
        message: `Driver ${driver.name} has been assigned to your order`,
        type: 'driver_assignment',
        orderId: order.id,
      });
    }

    console.log('Order assigned to driver:', orderId, driverId);
  }, [orders, drivers, queue]);

  const addDriver = useCallback(async (driverData: Omit<Driver, 'id' | 'createdAt' | 'lastStatusUpdate'>): Promise<string> => {
    const newDriver: Driver = {
      ...driverData,
      id: generateId(),
      createdAt: Date.now(),
      lastStatusUpdate: Date.now(),
    };

    const updatedDrivers = [...drivers, newDriver];
    setDrivers(updatedDrivers);
    await StorageService.saveDrivers(updatedDrivers);

    console.log('Driver added:', newDriver.id);
    return newDriver.id;
  }, [drivers]);

  const updateDriver = useCallback(async (driverId: string, updates: Partial<Driver>) => {
    const updatedDrivers = drivers.map(d => {
      if (d.id === driverId) {
        return { ...d, ...updates, lastStatusUpdate: Date.now() };
      }
      return d;
    });

    setDrivers(updatedDrivers);
    await StorageService.saveDrivers(updatedDrivers);

    console.log('Driver updated:', driverId);
  }, [drivers]);

  const deleteDriver = useCallback(async (driverId: string) => {
    const updatedDrivers = drivers.filter(d => d.id !== driverId);
    setDrivers(updatedDrivers);
    await StorageService.saveDrivers(updatedDrivers);

    console.log('Driver deleted:', driverId);
  }, [drivers]);

  const addNotification = useCallback((notifData: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotif: Notification = {
      id: generateId(),
      ...notifData,
      read: false,
      createdAt: Date.now(),
    };

    const updatedNotifications = [...notifications, newNotif];
    setNotifications(updatedNotifications);
    StorageService.saveNotifications(updatedNotifications);
  }, [notifications]);

  const markNotificationAsRead = useCallback(async (notifId: string) => {
    const updatedNotifications = notifications.map(n => {
      if (n.id === notifId) {
        return { ...n, read: true };
      }
      return n;
    });

    setNotifications(updatedNotifications);
    await StorageService.saveNotifications(updatedNotifications);
  }, [notifications]);

  return {
    orders,
    drivers,
    queue,
    notifications,
    isLoading,
    createOrder,
    updateOrderStatus,
    assignOrderToDriver,
    addDriver,
    updateDriver,
    deleteDriver,
    addNotification,
    markNotificationAsRead,
    saveAllData,
  };
});
