import { ApiClient, API_ENDPOINTS } from '@kanchan/shared';
import { 
  Customer, 
  Order, 
  DailyUpdate, 
  DailyUpdateInput,
  PriceSettings,
  DashboardStats,
  Bill
} from '@kanchan/types';

class WebApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
      timeout: 10000,
    });
  }

  // Customer APIs
  async getCustomers(): Promise<Customer[]> {
    const response = await this.client.get<Customer[]>(API_ENDPOINTS.CUSTOMERS);
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.client.get<Customer>(`${API_ENDPOINTS.CUSTOMERS}/${id}`);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    const response = await this.client.post<Customer>(API_ENDPOINTS.CUSTOMERS, customer);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await this.client.put<Customer>(`${API_ENDPOINTS.CUSTOMERS}/${id}`, customer);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  // Order APIs
  async getOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>(API_ENDPOINTS.ORDERS);
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.client.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    const response = await this.client.post<Order>(API_ENDPOINTS.ORDERS, order);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  async updateOrder(id: string, order: Partial<Order>): Promise<Order> {
    const response = await this.client.put<Order>(`${API_ENDPOINTS.ORDERS}/${id}`, order);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  async deleteOrder(id: string): Promise<void> {
    const response = await this.client.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
    if (!response.success) throw new Error(response.error);
  }

  // Daily Update APIs
  async getDailyUpdates(date: string): Promise<DailyUpdate[]> {
    const response = await this.client.get<DailyUpdate[]>(API_ENDPOINTS.DAILY_UPDATES, { date });
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  }

  async saveDailyUpdate(updateData: DailyUpdateInput): Promise<DailyUpdate> {
    const response = await this.client.post<DailyUpdate>(API_ENDPOINTS.DAILY_UPDATES, updateData);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  async getMonthlyBills(month: string): Promise<Bill[]> {
    const response = await this.client.get<Bill[]>(`${API_ENDPOINTS.DAILY_UPDATES}/monthly-bills`, { month });
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  }

  async getLedgerData(customerId: string, month: string): Promise<any[]> {
    const response = await this.client.get(`${API_ENDPOINTS.DAILY_UPDATES}/ledger`, { customer_id: customerId, month });
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.client.get<DashboardStats>(API_ENDPOINTS.DASHBOARD);
    if (!response.success) throw new Error(response.error);
    return response.data!;
  }

  // Settings APIs
  async getPrices(): Promise<PriceSettings[]> {
    const response = await this.client.get<PriceSettings[]>(`${API_ENDPOINTS.SETTINGS}/prices`);
    if (!response.success) throw new Error(response.error);
    return response.data || [];
  }

  async updatePrices(prices: Partial<PriceSettings>): Promise<void> {
    const response = await this.client.post(`${API_ENDPOINTS.SETTINGS}/prices`, prices);
    if (!response.success) throw new Error(response.error);
  }

  // Bills APIs
  async saveMonthlyBills(bills: Bill[]): Promise<void> {
    const response = await this.client.post(`${API_ENDPOINTS.BILLS}/save-monthly-bills`, { bills });
    if (!response.success) throw new Error(response.error);
  }
}

export const apiService = new WebApiService();
export * from '@kanchan/types';