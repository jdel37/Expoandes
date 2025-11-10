// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';
import socketService from '../services/socketService';
import eventBus from '../utils/EventBus';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar la app
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        
                // Conectar socket
                // await socketService.connect();
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiService.login({ email, password });
      
      if (response.status === 'success') {
        setUser(response.data.user);
        
        // Conectar socket
        // await socketService.connect();
        
        // Disparar evento para que AppContext recargue datos
        eventBus.emit('userAuthenticated');
        
        return { success: true, message: 'Login exitoso' };
      } else {
        return { success: false, message: response.message || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiService.register(userData);
      
      if (response.status === 'success') {
        setUser(response.data.user);
        
        // Conectar socket
        // await socketService.connect();
        
        // Disparar evento para que AppContext recargue datos
        eventBus.emit('userAuthenticated');
        
        return { success: true, message: 'Registro exitoso' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.message || 'Error al registrarse' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Desconectar socket
      socketService.disconnect();
      
      // Limpiar datos locales
      await apiService.logout();
      setUser(null);
      
      // Disparar evento para que AppContext limpie datos
      eventBus.emit('userLoggedOut');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await apiService.updatePreferences(preferences);
      
      if (response.status === 'success') {
        updateUser(response.data.user);
        return { success: true, message: 'Preferencias actualizadas' };
      }
    } catch (error) {
      console.error('Update preferences error:', error);
      return { 
        success: false, 
        message: error.message || 'Error al actualizar preferencias' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      register,
      logout, 
      updateUser,
      updatePreferences
    }}>
      {children}
    </AuthContext.Provider>
  );
};

