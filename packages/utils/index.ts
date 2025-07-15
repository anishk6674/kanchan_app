import { CustomerType } from '@kanchan/types';

// Date utilities
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN');
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-IN');
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getPreviousDay = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

// Customer utilities
export const getCustomerTypeLabel = (type: CustomerType): string => {
  switch (type) {
    case 'shop': return 'Shop';
    case 'monthly': return 'Monthly';
    case 'order': return 'Order';
    default: return 'Unknown';
  }
};

export const getCustomerTypeColor = (type: CustomerType): string => {
  switch (type) {
    case 'shop': return '#1e40af';
    case 'monthly': return '#059669';
    case 'order': return '#7c3aed';
    default: return '#64748b';
  }
};

// Validation utilities
export const validatePhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Price calculation utilities
export const calculateBillAmount = (
  customerType: CustomerType,
  totalCans: number,
  prices: { shop_price: number; monthly_price: number; order_price: number }
): number => {
  switch (customerType) {
    case 'shop':
      return totalCans * prices.shop_price;
    case 'monthly':
      return totalCans * prices.monthly_price;
    case 'order':
      return totalCans * prices.order_price;
    default:
      return 0;
  }
};

// Search utilities
export const searchCustomers = (customers: any[], searchTerm: string) => {
  if (!searchTerm.trim()) return customers;
  
  return customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_number.includes(searchTerm)
  );
};

// Storage utilities (for mobile)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  LAST_SYNC: 'last_sync',
  OFFLINE_DATA: 'offline_data',
} as const;

// API utilities
export const createApiUrl = (baseUrl: string, endpoint: string, params?: Record<string, string>): string => {
  const url = new URL(endpoint, baseUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.error) return error.response.data.error;
  return 'An unexpected error occurred';
};

// Number formatting utilities
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

// Status utilities
export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'processing': return '#3b82f6';
    case 'delivered': return '#10b981';
    case 'cancelled': return '#ef4444';
    default: return '#6b7280';
  }
};

export const getOrderStatusBadgeClass = (status: string): string => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'processing':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    case 'delivered':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'cancelled':
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};