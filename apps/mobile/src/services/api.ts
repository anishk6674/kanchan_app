import { ApiClient, API_ENDPOINTS } from '@kanchan/shared';
import { Customer, DailyUpdate, DailyUpdateInput } from '@kanchan/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your computer's local IP address
const BASE_URL = 'http://192.168.1.100:5000'; // Change this to your computer's IP

class MobileApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient({
      baseURL: BASE_URL,
      timeout: 15000,
    });
  }

  // Get all customers
  async getCustomers(): Promise<Customer[]> {
    const response = await this.client.get<Customer[]>(API_ENDPOINTS.CUSTOMERS);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch customers');
    }
    return response.data || [];
  }

  // Search customers by name or phone
  async searchCustomers(query: string): Promise<Customer[]> {
    const customers = await this.getCustomers();
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.phone_number.includes(query)
    );
  }

  // Get daily updates for a specific date
  async getDailyUpdates(date: string): Promise<DailyUpdate[]> {
    const response = await this.client.get<DailyUpdate[]>(API_ENDPOINTS.DAILY_UPDATES, { date });
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch daily updates');
    }
    return response.data || [];
  }

  // Save daily update
  async saveDailyUpdate(updateData: DailyUpdateInput): Promise<any> {
    const response = await this.client.post(API_ENDPOINTS.DAILY_UPDATES, updateData);
    if (!response.success) {
      throw new Error(response.error || 'Failed to save daily update');
    }
    return response.data;
  }

  // Get customer's current holding status
  async getCustomerStatus(customerId: string, date: string): Promise<DailyUpdate | null> {
    try {
      const updates = await this.getDailyUpdates(date);
      return updates.find(update => update.customer_id === customerId) || null;
    } catch (error) {
      console.error('Error fetching customer status:', error);
      return null;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get(API_ENDPOINTS.CUSTOMERS);
      return response.success;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Cache management
  async cacheData(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }
}

export const apiService = new MobileApiService();
export * from '@kanchan/types';