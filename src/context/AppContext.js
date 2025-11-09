import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';
import eventBus from '../utils/EventBus';
import { getTheme } from '../theme/colors';

const AppContext = createContext();

// Initial state
const initialState = {
  // User preferences
  notifications: true,
  darkMode: false,
  language: 'es',
  
  // Inventory data
  inventory: [],
  
  // Orders data
  orders: [],
  
  // Cash close data
  cashClose: {
    cash: '',
    sales: '',
    difference: null,
    lastClose: null
  },
  
  // Statistics
  stats: {
    dailySales: 0,
    totalOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0
  },
  salesAnalytics: {
    labels: [],
    values: []
  },
  
  // App state
  loading: false,
  error: null,
  lowStockThreshold: 5,
  mediumStockThreshold: 15
};

// Action types
const ActionTypes = {
  // Settings
  TOGGLE_NOTIFICATIONS: 'TOGGLE_NOTIFICATIONS',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_LANGUAGE: 'SET_LANGUAGE',
  
  // Inventory
  ADD_INVENTORY_ITEM: 'ADD_INVENTORY_ITEM',
  UPDATE_INVENTORY_ITEM: 'UPDATE_INVENTORY_ITEM',
  DELETE_INVENTORY_ITEM: 'DELETE_INVENTORY_ITEM',
  
  // Orders
  ADD_ORDER: 'ADD_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  DELETE_ORDER: 'DELETE_ORDER',
  
  // Cash close
  UPDATE_CASH_CLOSE: 'UPDATE_CASH_CLOSE',
  CLOSE_CASH: 'CLOSE_CASH',
  ADD_CASH_CLOSE: 'ADD_CASH_CLOSE',
  
  // App state
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Data persistence
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA',
  SET_LOW_STOCK_THRESHOLD: 'SET_LOW_STOCK_THRESHOLD',
  SET_MEDIUM_STOCK_THRESHOLD: 'SET_MEDIUM_STOCK_THRESHOLD'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_NOTIFICATIONS:
      return {
        ...state,
        notifications: !state.notifications
      };
      
    case ActionTypes.TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode
      };
      
    case ActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
      
    case ActionTypes.ADD_INVENTORY_ITEM:
      return {
        ...state,
        inventory: [...state.inventory, action.payload]
      };
      
    case ActionTypes.UPDATE_INVENTORY_ITEM:
      return {
        ...state,
        inventory: state.inventory.map(item => 
          item.id === action.payload.id ? { ...item, ...action.payload } : item
        )
      };
      
    case ActionTypes.DELETE_INVENTORY_ITEM:
      return {
        ...state,
        inventory: state.inventory.filter(item => item.id !== action.payload)
      };
      
    case ActionTypes.ADD_ORDER:
      return {
        ...state,
        orders: [...state.orders, action.payload]
      };
      
    case ActionTypes.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload.id 
            ? { ...order, status: action.payload.status, color: action.payload.color }
            : order
        )
      };
      
    case ActionTypes.DELETE_ORDER:
      return {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload)
      };
      
    case ActionTypes.UPDATE_CASH_CLOSE:
      return {
        ...state,
        cashClose: { ...state.cashClose, ...action.payload }
      };
      
    case ActionTypes.CLOSE_CASH:
      return {
        ...state,
        cashClose: action.payload
      };
      
    case ActionTypes.ADD_CASH_CLOSE:
      return {
        ...state,
        cashClose: action.payload
      };      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ActionTypes.LOAD_DATA:
      return {
        ...state,
        ...action.payload
      };
      
    case ActionTypes.SET_LOW_STOCK_THRESHOLD:
      return {
        ...state,
        lowStockThreshold: action.payload
      };

    case ActionTypes.SET_MEDIUM_STOCK_THRESHOLD:
      return {
        ...state,
        mediumStockThreshold: action.payload
      };

    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const theme = getTheme(state.darkMode ? 'dark' : 'light');

  const checkAuthAndLoadData = async () => {
    try {
      // Check if user is authenticated
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        // User is authenticated, load data from API
        await loadDataFromAPI();
      } else {
        // User not authenticated, load from local storage only
        await loadData();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      // Fallback to local storage
      await loadData();
    }
  };

  const loadDataFromAPI = async () => {
    try {
      // Load from API
      const [inventoryResponse, ordersResponse, cashCloseResponse, analyticsResponse, userResponse] = await Promise.all([
        apiService.getInventory(),
        apiService.getOrders(),
        apiService.getCurrentCashClose(),
        apiService.getDashboardAnalytics(),
        apiService.getCurrentUser()
      ]);

      dispatch({
        type: ActionTypes.LOAD_DATA,
        payload: {
          inventory: (inventoryResponse.data.items || []).map(item => ({
            ...item,
            id: item._id
          })),
          orders: (ordersResponse.data.orders || []).map(order => ({
            ...order,
            id: order._id
          })),
          cashClose: cashCloseResponse.data.cashClose || {
            cash: '',
            sales: '',
            difference: null,
            lastClose: null
          },
          stats: analyticsResponse.data.orders || {
            dailySales: 0,
            totalOrders: 0,
            completedOrders: 0,
            averageOrderValue: 0
          },
          lowStockThreshold: userResponse.data.user.preferences.lowStockThreshold || 5,
          mediumStockThreshold: userResponse.data.user.preferences.mediumStockThreshold || 15
        }
      });
    } catch (error) {
      console.error('Error loading data from API:', error);
      // Fallback to local storage
      loadData();
    }
  };

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('appData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: ActionTypes.LOAD_DATA, payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('appData', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Load data from API only when user is authenticated
  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  // Listen for auth events
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthAndLoadData();
    };

    // Listen for custom auth events using EventBus
    eventBus.on('userAuthenticated', handleAuthChange);
    eventBus.on('userLoggedOut', handleAuthChange);

    return () => {
      eventBus.off('userAuthenticated', handleAuthChange);
      eventBus.off('userLoggedOut', handleAuthChange);
    };
  }, []);

  // Save data to storage whenever state changes (for offline support)
  useEffect(() => {
    saveData();
  }, [state]);

  // Action creators
  const actions = {
    // Settings actions
    toggleNotifications: () => dispatch({ type: ActionTypes.TOGGLE_NOTIFICATIONS }),
    toggleDarkMode: () => dispatch({ type: ActionTypes.TOGGLE_DARK_MODE }),
    setLanguage: (language) => dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language }),
    
    // Data loading actions
    reloadData: async () => {
      try {
        await checkAuthAndLoadData();
      } catch (error) {
        console.error('Error reloading data:', error);
        throw error;
      }
    },
    
    // Inventory actions
    addInventoryItem: async (item) => {
      try {
        const response = await apiService.createInventoryItem(item);
        const newItemFromApi = response.data.item || response.data;

        if (!newItemFromApi || !newItemFromApi._id) { // Check for _id
          console.error("API did not return a valid item object with an _id.", response.data);
          throw new Error("Invalid data received from server");
        }

        // Transform the item to match frontend data structure
        const newItem = {
          ...newItemFromApi,
          id: newItemFromApi._id // Create the 'id' property
        };

        dispatch({ type: ActionTypes.ADD_INVENTORY_ITEM, payload: newItem });
        return response;
      } catch (error) {
        console.error('Error adding inventory item:', error);
        throw error;
      }
    },
    updateInventoryItem: async (id, updates) => {
      try {
        const response = await apiService.updateInventoryItem(id, updates);
        dispatch({ type: ActionTypes.UPDATE_INVENTORY_ITEM, payload: { id, ...updates } });
        return response;
      } catch (error) {
        console.error('Error updating inventory item:', error);
        throw error;
      }
    },
    deleteInventoryItem: async (id) => {
      try {
        await apiService.deleteInventoryItem(id);
        dispatch({ type: ActionTypes.DELETE_INVENTORY_ITEM, payload: id });
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        throw error;
      }
    },
    
    // Orders actions
    addOrder: async (order) => {
      try {
        const response = await apiService.createOrder(order);
        const newOrder = {
          ...response.data.order,
          id: response.data.order._id
        };
        dispatch({ type: ActionTypes.ADD_ORDER, payload: newOrder });
        return response;
      } catch (error) {
        console.error('Error adding order:', error);
        throw error;
      }
    },
    updateOrderStatus: async (id, status) => {
      try {
        const response = await apiService.updateOrderStatus(id, status);
        const color = getStatusColor(status);
        dispatch({ type: ActionTypes.UPDATE_ORDER_STATUS, payload: { id, status, color } });
        if (status === 'delivered') {
          await loadDataFromAPI();
        }
        return response;
      } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },
    deleteOrder: async (id) => {
      try {
        await apiService.deleteOrder(id);
        dispatch({ type: ActionTypes.DELETE_ORDER, payload: id });
      } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
      }
    },
    
    // Cash close actions
    updateCashClose: (updates) => {
      dispatch({ type: ActionTypes.UPDATE_CASH_CLOSE, payload: updates });
    },
    addCashClose: async (cashCloseData) => {
      try {
        const response = await apiService.createCashClose(cashCloseData);
        const newCashClose = {
          ...response.data.cashClose,
          id: response.data.cashClose._id
        };
        dispatch({ type: ActionTypes.ADD_CASH_CLOSE, payload: newCashClose });
        return response;
      } catch (error) {
        console.error('Error adding cash close:', error);
        throw error;
      }
    },
    closeCash: async (closingData) => {
      try {
        const response = await apiService.closeCash(closingData._id, closingData);
        const closedCashClose = {
          ...response.data.cashClose,
          id: response.data.cashClose._id
        };
        dispatch({ type: ActionTypes.CLOSE_CASH, payload: closedCashClose });
        return response;
      } catch (error) {
        console.error('Error closing cash:', error);
        throw error;
      }
    },
    
    // App state actions
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    setLowStockThreshold: (threshold) => dispatch({ type: ActionTypes.SET_LOW_STOCK_THRESHOLD, payload: threshold }),
    setMediumStockThreshold: (threshold) => dispatch({ type: ActionTypes.SET_MEDIUM_STOCK_THRESHOLD, payload: threshold }),
    updatePreferences: async (preferences) => {
      try {
        await apiService.updatePreferences(preferences);
      } catch (error) {
        console.error('Error updating preferences:', error);
        throw error;
      }
    }
  };

  // Helper functions
  const getRandomColor = () => {
    const colors = ['#7ED321', '#FFB800', '#3742FA', '#FF6B35', '#95AA61', '#FF4757'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Entregado': return '#7ED321';
      case 'Pendiente': return '#FFB800';
      case 'En Proceso': return '#3742FA';
      default: return '#7A8A7A';
    }
  };

  const getStockStatus = (qty) => {
    if (qty <= state.lowStockThreshold) return { status: 'Bajo', color: '#FF4757' };
    if (qty <= state.mediumStockThreshold) return { status: 'Medio', color: '#FFB800' };
    return { status: 'Alto', color: '#7ED321' };
  };

  const calculateStats = () => {
    const totalOrders = state.orders.length;
    const completedOrders = state.orders.filter(order => order.status === 'Entregado').length;
    const totalRevenue = state.orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      completedOrders,
      totalRevenue,
      averageOrderValue
    };
  };

  const calculateCOGS = () => {
    let cogs = 0;
    state.orders.forEach(order => {
      order.items.forEach(item => {
        const inventoryItem = state.inventory.find(invItem => invItem.id === item.id);
        if (inventoryItem) {
          cogs += inventoryItem.costPrice * item.quantity;
        }
      });
    });
    return cogs;
  };

  const value = {
    ...state,
    ...actions,
    theme,
    getStockStatus,
    calculateStats,
    calculateCOGS
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
