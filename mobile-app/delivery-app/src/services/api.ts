import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your computer's local IP address
// To find your IP: Windows (ipconfig), Mac/Linux (ifconfig)
const BASE_URL = 'http://192.168.1.100:5000'; // Change this to your computer's IP

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging and auth
api.interceptors.request.use(
  async (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    
    // Add auth token if available
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('No auth token found');
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      AsyncStorage.removeItem('auth_token');
    }
    
    return Promise.reject(error);
  },
);

export interface Customer {
  customer_id: string;
  name: string;
  phone_number: string;
  address: string;
  customer_type: 'shop' | 'monthly' | 'order';
  can_qty?: number;
  advance_amount?: number;
}

export interface DailyUpdateData {
  customer_id: string;
  date: string;
  delivered_qty: number;
  collected_qty: number;
  notes?: string;
}

export interface DailyUpdate {
  update_id: string;
  customer_id: string;
  date: string;
  delivered_qty: number;
  collected_qty: number;
  holding_status: number;
  notes?: string;
}

export const apiService = {
  // Get all customers
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await api.get('/api/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers. Please check your network connection.');
    }
  },

  // Search customers by name or phone
  searchCustomers: async (query: string): Promise<Customer[]> => {
    try {
      const response = await api.get('/api/customers');
      const customers = response.data;
      return customers.filter((customer: Customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone_number.includes(query)
      );
    } catch (error) {
      console.error('Error searching customers:', error);
      throw new Error('Failed to search customers.');
    }
  },

  // Get daily updates for a specific date
  getDailyUpdates: async (date: string): Promise<DailyUpdate[]> => {
    try {
      const response = await api.get(`/api/daily-updates?date=${date}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching daily updates:', error);
      throw new Error('Failed to fetch daily updates.');
    }
  },

  // Save daily update
  saveDailyUpdate: async (updateData: DailyUpdateData): Promise<any> => {
    try {
      const response = await api.post('/api/daily-updates', updateData);
      return response.data;
    } catch (error) {
      console.error('Error saving daily update:', error);
      throw new Error('Failed to save daily update. Please try again.');
    }
  },

  // Get customer's current holding status
  getCustomerStatus: async (customerId: string, date: string): Promise<DailyUpdate | null> => {
    try {
      const response = await api.get(`/api/daily-updates?date=${date}`);
      const updates = response.data;
      return updates.find((update: DailyUpdate) => update.customer_id === customerId) || null;
    } catch (error) {
      console.error('Error fetching customer status:', error);
      return null;
    }
  },

  // Test connection
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await api.get('/api/customers');
      return response.status === 200;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },
};

export default api;