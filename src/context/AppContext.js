import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';
import eventBus from '../utils/EventBus';

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
  
  // Orders data (old dummy data for reference)
  /*orders: [
    { 
      id: '001', 
      customer: 'Mesa 1', 
      total: 25000, 
      status: 'Entregado',
      time: '12:30 PM',
      items: 3,
      color: '#7ED321',
      date: new Date().toISOString()
    },
    { 
      id: '002', 
      customer: 'Mesa 2', 
      total: 38000, 
      status: 'Pendiente',
      time: '1:15 PM',
      items: 5,
      color: '#FFB800',
      date: new Date().toISOString()
    },
    { 
      id: '003', 
      customer: 'Domicilio', 
      total: 54000, 
      status: 'Entregado',
      time: '11:45 AM',
      items: 4,
      color: '#7ED321',
      date: new Date().toISOString()
    },
    { 
      id: '004', 
      customer: 'Mesa 3', 
      total: 42000, 
      status: 'En Proceso',
      time: '2:00 PM',
      items: 6,
      color: '#3742FA',
      date: new Date().toISOString()
    },
  ]*/
  
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
  
  // App state
  loading: false,
  error: null
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
  
  // App state
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Data persistence
  LOAD_DATA: 'LOAD_DATA',
  SAVE_DATA: 'SAVE_DATA'
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
      const diff = parseFloat(state.cashClose.cash || 0) - parseFloat(state.cashClose.sales || 0);
      return {
        ...state,
        cashClose: {
          ...state.cashClose,
          difference: diff,
          lastClose: new Date().toISOString()
        }
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
      
    default:
      return state;
  }
};

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
      const [inventoryResponse, ordersResponse, cashCloseResponse, analyticsResponse] = await Promise.all([
        apiService.getInventory(),
        apiService.getOrders(),
        apiService.getCashCloses(),
        apiService.getDashboardAnalytics()
      ]);

      dispatch({
        type: ActionTypes.LOAD_DATA,
        payload: {
          inventory: (inventoryResponse.data.items || []).map(item => ({
            ...item,
            id: item._id
          })),
          orders: ordersResponse.data.orders || [],
          cashClose: {
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
          }
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
        dispatch({ type: ActionTypes.ADD_ORDER, payload: response.data.order });
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
    closeCash: async (closingData) => {
      try {
        const response = await apiService.closeCash(closingData.id, closingData);
        dispatch({ type: ActionTypes.CLOSE_CASH });
        return response;
      } catch (error) {
        console.error('Error closing cash:', error);
        throw error;
      }
    },
    
    // App state actions
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR })
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
    if (qty <= 5) return { status: 'Bajo', color: '#FF4757' };
    if (qty <= 15) return { status: 'Medio', color: '#FFB800' };
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

  const value = {
    ...state,
    ...actions,
    getStockStatus,
    calculateStats
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
