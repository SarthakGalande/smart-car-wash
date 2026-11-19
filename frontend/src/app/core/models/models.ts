export interface User {
  id?: string;
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt?: string;
}

export interface Vehicle {
  _id?: string;
  id?: string;
  user?: string;
  brand: string;
  model: string;
  registrationNumber: string;
  vehicleType: 'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'Pickup / Other';
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  color?: string;
  isDefault?: boolean;
  createdAt?: string;
}

export interface Service {
  _id?: string;
  id?: string;
  serviceName: string;
  slug: string;
  description: string;
  price: number;
  duration: number; // minutes
  image: string;
  features: string[];
  category: 'Exterior' | 'Interior' | 'Complete' | 'Detailing' | 'Specialized';
  status: 'ACTIVE' | 'INACTIVE';
  isPopular?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Package {
  _id?: string;
  id?: string;
  packageName: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  includedServices?: Service[];
  popular?: boolean;
  badge?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface WashCenter {
  _id?: string;
  id?: string;
  centerName: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  openingTime: string;
  closingTime: string;
  capacityPerSlot: number;
  slotDurationMinutes?: number;
  rating?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface TimeSlotOption {
  id?: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookedCount: number;
  remainingSpots: number;
  isAvailable: boolean;
  isBlocked: boolean;
  isPast: boolean;
}

export interface Booking {
  _id?: string;
  id?: string;
  bookingReference: string;
  user: User | string;
  vehicle: Vehicle;
  vehicleSnapshot?: {
    brand: string;
    model: string;
    registrationNumber: string;
    vehicleType: string;
    color?: string;
  };
  center: WashCenter;
  package?: Package;
  services?: Array<{
    service?: Service | string;
    serviceName: string;
    price: number;
  }>;
  bookingDate: string;
  timeSlot: string;
  basePrice: number;
  packagePrice?: number;
  servicesPrice?: number;
  discountAmount?: number;
  taxAmount?: number;
  finalAmount: number;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'CASH' | 'UPI' | 'DEBIT_CARD' | 'CREDIT_CARD' | 'ONLINE';
  cancellationReason?: string;
  notes?: string;
  createdAt?: string;
}

export interface PaymentRecord {
  _id?: string;
  booking: Booking | string;
  user: User | string;
  transactionId: string;
  paymentMethod: string;
  amount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentDate: string;
}

export interface Review {
  _id?: string;
  user: User;
  booking: string;
  service?: Service;
  package?: Package;
  rating: number;
  comment: string;
  isApproved: boolean;
  adminResponse?: string;
  createdAt?: string;
}

export interface NotificationItem {
  _id?: string;
  user: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt?: string;
}

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt?: string;
}

export interface Coupon {
  _id?: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minBookingAmount: number;
  maxDiscount?: number;
  validUntil: string;
  usageLimit?: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DashboardStats {
  totalCustomers: number;
  totalVehicles: number;
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
}
