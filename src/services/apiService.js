import AsyncStorage from '@react-native-async-storage/async-storage';
import { NETWORK_CONFIG } from '../config/network';

const API_BASE_URL = NETWORK_CONFIG.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Helper method to handle responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || 'Error en la solicitud');
      error.data = data;
      error.status = response.status;
      throw error;
    }
    
    return data;
  }

  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await this.handleResponse(response);
    
    if (data.data.token) {
      await AsyncStorage.setItem('authToken', data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await this.handleResponse(response);
    
    if (data.data.token) {
      await AsyncStorage.setItem('authToken', data.data.token);
      await AsyncStorage.setItem('userData', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updatePreferences(preferences) {
    const response = await fetch(`${this.baseURL}/auth/update-preferences`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(preferences),
    });
    
    return this.handleResponse(response);
  }

  // Inventory endpoints
  async getInventory(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/inventory?${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getInventoryItem(id) {
    const response = await fetch(`${this.baseURL}/inventory/${id}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createInventoryItem(itemData) {
    const response = await fetch(`${this.baseURL}/inventory`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    
    return this.handleResponse(response);
  }

  async updateInventoryItem(id, itemData) {
    const response = await fetch(`${this.baseURL}/inventory/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(itemData),
    });
    
    return this.handleResponse(response);
  }

  async deleteInventoryItem(id) {
    const response = await fetch(`${this.baseURL}/inventory/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateInventoryQuantity(id, quantity, operation = 'set') {
    const response = await fetch(`${this.baseURL}/inventory/${id}/update-quantity`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ quantity, operation }),
    });
    
    return this.handleResponse(response);
  }

  async getLowStockItems() {
    const response = await fetch(`${this.baseURL}/inventory/low-stock`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getInventorySummary() {
    const response = await fetch(`${this.baseURL}/inventory/summary`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Orders endpoints
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/orders?${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getOrder(id) {
    const response = await fetch(`${this.baseURL}/orders/${id}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createOrder(orderData) {
    const response = await fetch(`${this.baseURL}/orders`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    return this.handleResponse(response);
  }

  async updateOrder(id, orderData) {
    const response = await fetch(`${this.baseURL}/orders/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    return this.handleResponse(response);
  }

  async updateOrderStatus(id, status) {
    const response = await fetch(`${this.baseURL}/orders/${id}/status`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    
    return this.handleResponse(response);
  }

  async deleteOrder(id) {
    const response = await fetch(`${this.baseURL}/orders/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getOrdersSummary(date) {
    const queryString = date ? `?date=${date.toISOString()}` : '';
    const response = await fetch(`${this.baseURL}/orders/summary/daily${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Cash Close endpoints
  async getCashCloses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/cash-close?${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getCashClose(id) {
    const response = await fetch(`${this.baseURL}/cash-close/${id}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createCashClose(cashCloseData) {
    const response = await fetch(`${this.baseURL}/cash-close`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(cashCloseData),
    });
    
    return this.handleResponse(response);
  }

  async closeCash(id, closingData) {
    const response = await fetch(`${this.baseURL}/cash-close/${id}/close`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(closingData),
    });
    
    return this.handleResponse(response);
  }

  async verifyCashClose(id) {
    const response = await fetch(`${this.baseURL}/cash-close/${id}/verify`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async addExpense(id, expenseData) {
    const response = await fetch(`${this.baseURL}/cash-close/${id}/expenses`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(expenseData),
    });
    
    return this.handleResponse(response);
  }

  async getCashCloseSummary(date) {
    const queryString = date ? `?date=${date.toISOString()}` : '';
    const response = await fetch(`${this.baseURL}/cash-close/summary/daily${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getCurrentCashClose() {
    const response = await fetch(`${this.baseURL}/cash-close/current`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Analytics endpoints
  async getDashboardAnalytics() {
    const response = await fetch(`${this.baseURL}/analytics/dashboard`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getSalesAnalytics(startDate, endDate, groupBy = 'day') {
    const queryString = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupBy
    }).toString();
    
    const response = await fetch(`${this.baseURL}/analytics/sales?${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getInventoryAnalytics() {
    const response = await fetch(`${this.baseURL}/analytics/inventory`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getOrdersAnalytics(startDate, endDate) {
    const queryString = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }).toString();
    
    const response = await fetch(`${this.baseURL}/analytics/orders?${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getProjections(period = 'week') {
    const queryString = new URLSearchParams({ period }).toString();
    const response = await fetch(`${this.baseURL}/analytics/projections?${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Users endpoints
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/users?${queryString}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getUser(id) {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createUser(userData) {
    const response = await fetch(`${this.baseURL}/users`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse(response);
  }

  async updateUser(id, userData) {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    return this.handleResponse(response);
  }

  async deleteUser(id) {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async changePassword(id, passwordData) {
    const response = await fetch(`${this.baseURL}/users/${id}/change-password`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });
    
    return this.handleResponse(response);
  }

  async toggleUserStatus(id) {
    const response = await fetch(`${this.baseURL}/users/${id}/toggle-status`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
    });
    
    return this.handleResponse(response);
  }
}

export default new ApiService();
