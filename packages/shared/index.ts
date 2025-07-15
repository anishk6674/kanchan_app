// Shared API client and configurations
import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '@kanchan/types';
import { getErrorMessage } from '@kanchan/utils';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('API Response Error:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, { params });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: getErrorMessage(error) };
    }
  }
}

// Shared constants
export const API_ENDPOINTS = {
  CUSTOMERS: '/api/customers',
  ORDERS: '/api/orders',
  DAILY_UPDATES: '/api/daily-updates',
  DASHBOARD: '/api/dashboard',
  SETTINGS: '/api/settings',
  BILLS: '/api/bills',
} as const;

// Environment configuration
export const getConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  
  return {
    API_BASE_URL: isDev ? 'http://localhost:5000' : process.env.API_BASE_URL || 'http://localhost:5000',
    WEB_PORT: process.env.WEB_PORT || 5173,
    SERVER_PORT: process.env.SERVER_PORT || 5000,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_DATABASE: process.env.DB_DATABASE || 'kanchan_water',
  };
};

// Export everything from types and utils for convenience
export * from '@kanchan/types';
export * from '@kanchan/utils';