// Shared types across all applications

// Customer Types
export type CustomerType = 'shop' | 'monthly' | 'order';

export interface Customer {
  customer_id: string;
  name: string;
  phone_number: string;
  alternate_number?: string;
  address: string;
  customer_type: CustomerType;
  advance_amount?: number;
  can_qty?: number;
  created_at: string;
  updated_at?: string;
}

// Daily Update Types
export interface DailyUpdate {
  update_id: string;
  customer_id: string;
  date: string;
  delivered_qty: number;
  collected_qty: number;
  holding_status: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
  customer?: Customer;
}

export interface DailyUpdateInput {
  customer_id: string;
  date: string;
  delivered_qty: number;
  collected_qty: number;
  notes?: string;
}

// Order Types
export interface Order {
  id: number;
  order_date: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  can_qty: number;
  collected_qty?: number;
  collected_date?: string;
  delivery_amount?: number;
  delivery_date: string;
  delivery_time: string;
  order_status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// Pricing Types
export interface PriceSettings {
  price_id?: string;
  shop_price: number;
  monthly_price: number;
  order_price: number;
  effective_from: string;
  is_active: boolean;
}

// Bill Types
export interface Bill {
  bill_id?: string;
  customer_id: string;
  bill_month: string;
  paid_status: boolean;
  sent_status: boolean;
  bill_amount: number;
  total_cans: number;
  delivery_days: number;
  created_at?: string;
}

// Dashboard Stats
export interface DashboardStats {
  OrdersTotal: number;
  totalMonthlyCustomers: number;
  shopCustomersTotal: number;
  cansDeliveredToday: number;
  cansCollectedToday: number;
  pendingCansTotal: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Mobile App Specific Types
export interface MobileStats {
  todayDeliveries: number;
  todayCollections: number;
  pendingUpdates: number;
  totalCustomers: number;
}

// Form Types
export interface CustomerFormData {
  name: string;
  phone_number: string;
  alternate_number?: string;
  address: string;
  customer_type: CustomerType;
  advance_amount?: number;
  can_qty?: number;
}

export interface OrderFormData {
  order_date: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_amount?: number;
  can_qty: number;
  collected_qty?: number;
  collected_date?: string;
  delivery_date: string;
  delivery_time: string;
  order_status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  notes?: string;
}

// Filter Types
export interface CustomerFilters {
  search?: string;
  type?: CustomerType | 'all';
}

export interface OrderFilters {
  search?: string;
  status?: 'all' | 'pending' | 'processing' | 'delivered' | 'cancelled';
  dateFrom?: string;
  dateTo?: string;
}

export interface DailyUpdateFilters {
  date: string;
  search?: string;
  type?: CustomerType | 'all';
}