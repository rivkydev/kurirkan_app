export type UserRole = 'customer' | 'driver' | 'admin';

export type OrderStatus = 
  | 'pending'
  | 'assigned'
  | 'driver_on_way'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export type DriverStatus = 'on_duty' | 'off_duty' | 'busy';

export type ServiceType = 'delivery' | 'ride';

export interface Address {
  label: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  password: string;
  role: 'customer';
  addresses: Address[];
  paymentMethods: string[];
  createdAt: number;
  lastLogin: number;
}

export interface Driver {
  id: string;
  driverId: string;
  name: string;
  phone: string;
  username: string;
  password: string;
  role: 'driver';
  isAdmin: boolean;
  status: DriverStatus;
  currentOrder: string | null;
  todayOrders: number;
  totalOrders: number;
  rating: number;
  earnings: number;
  createdAt: number;
  lastStatusUpdate: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId: string | null;
  driverName: string | null;
  serviceType: ServiceType;
  status: OrderStatus;
  
  pickupAddress: string;
  deliveryAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  deliveryLat?: number;
  deliveryLng?: number;
  
  itemDescription?: string;
  itemWeight?: string;
  itemValue?: string;
  
  distance?: string;
  price: number;
  paymentMethod: string;
  
  notes?: string;
  
  createdAt: number;
  assignedAt: number | null;
  pickedUpAt: number | null;
  deliveredAt: number | null;
  cancelledAt: number | null;
  cancelReason?: string;
  
  timeline: OrderTimeline[];
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: number;
  note?: string;
}

export interface QueueItem {
  orderId: string;
  priority: number;
  addedAt: number;
}

export interface AppSettings {
  orderTimeoutDuration: number;
  queueCheckInterval: number;
  autoCleanupDays: number;
  operatingHours: {
    start: string;
    end: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  isAdmin?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order_update' | 'system' | 'driver_assignment';
  orderId?: string;
  read: boolean;
  createdAt: number;
}
