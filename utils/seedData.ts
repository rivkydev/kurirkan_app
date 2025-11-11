import { Driver } from '@/types';
import { StorageService, hashPassword } from '@/utils/storage';

export async function initializeSeedData() {
  try {
    const existingDrivers = await StorageService.getDrivers();
    
    if (existingDrivers.length === 0) {
      console.log('Initializing seed data...');
      
      const seedDrivers: Driver[] = [
        {
          id: 'admin-001',
          driverId: 'ADMIN001',
          name: 'Admin Kurir Kan',
          phone: '628123456789',
          username: 'admin',
          password: hashPassword('admin123'),
          role: 'driver',
          isAdmin: true,
          status: 'off_duty',
          currentOrder: null,
          todayOrders: 0,
          totalOrders: 0,
          rating: 5.0,
          earnings: 0,
          createdAt: Date.now(),
          lastStatusUpdate: Date.now(),
        },
        {
          id: 'driver-001',
          driverId: 'DRV001',
          name: 'Budi Santoso',
          phone: '628111111111',
          username: 'budi',
          password: hashPassword('budi123'),
          role: 'driver',
          isAdmin: false,
          status: 'off_duty',
          currentOrder: null,
          todayOrders: 0,
          totalOrders: 0,
          rating: 4.8,
          earnings: 0,
          createdAt: Date.now(),
          lastStatusUpdate: Date.now(),
        },
        {
          id: 'driver-002',
          driverId: 'DRV002',
          name: 'Siti Rahayu',
          phone: '628222222222',
          username: 'siti',
          password: hashPassword('siti123'),
          role: 'driver',
          isAdmin: false,
          status: 'off_duty',
          currentOrder: null,
          todayOrders: 0,
          totalOrders: 0,
          rating: 4.9,
          earnings: 0,
          createdAt: Date.now(),
          lastStatusUpdate: Date.now(),
        },
      ];

      await StorageService.saveDrivers(seedDrivers);
      console.log('Seed data initialized successfully!');
      console.log('Admin credentials: username=admin, password=admin123');
      console.log('Driver credentials: username=budi, password=budi123 or username=siti, password=siti123');
    }
  } catch (error) {
    console.error('Error initializing seed data:', error);
  }
}
