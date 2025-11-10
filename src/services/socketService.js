import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NETWORK_CONFIG } from '../config/network';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.restaurantId = null;
  }

  // Conectar al servidor
  async connect() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.log('No hay usuario autenticado');
        return;
      }

      const user = JSON.parse(userData);
      this.restaurantId = user.restaurant?.id;

      if (!this.restaurantId) {
        console.log('No hay ID de restaurante');
        return;
      }

      if (NETWORK_CONFIG.SOCKET_URL.includes('expoandes-backend-c91zdtdcy-jdel37s-projects.vercel.app/api')) {
        console.warn('Socket.IO connection skipped: Vercel does not support WebSockets directly. Please provide a separate Socket.IO server URL.');
        return;
      }

      // Conectar al servidor
      this.socket = io(NETWORK_CONFIG.SOCKET_URL, {
        transports: ['websocket'],
        timeout: 20000,
      });

      // Eventos de conexión
      this.socket.on('connect', () => {
        console.log('🔌 Conectado al servidor');
        this.isConnected = true;
        
        // Unirse a la sala del restaurante
        this.socket.emit('join-restaurant', this.restaurantId);
      });

      this.socket.on('disconnect', () => {
        console.log('🔌 Desconectado del servidor');
        this.isConnected = false;
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
        this.isConnected = false;
      });

      return this.socket;
    } catch (error) {
      console.error('Error conectando socket:', error);
    }
  }

  // Desconectar del servidor
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Suscribirse a actualizaciones de inventario
  onInventoryUpdate(callback) {
    if (this.socket) {
      this.socket.on('inventory-updated', callback);
    }
  }

  // Suscribirse a actualizaciones de pedidos
  onOrderUpdate(callback) {
    if (this.socket) {
      this.socket.on('order-updated', callback);
    }
  }

  // Suscribirse a actualizaciones de cierre de caja
  onCashCloseUpdate(callback) {
    if (this.socket) {
      this.socket.on('cash-close-updated', callback);
    }
  }

  // Emitir actualización de inventario
  emitInventoryUpdate(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('inventory-update', {
        ...data,
        restaurantId: this.restaurantId
      });
    }
  }

  // Emitir actualización de pedido
  emitOrderUpdate(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('order-update', {
        ...data,
        restaurantId: this.restaurantId
      });
    }
  }

  // Emitir actualización de cierre de caja
  emitCashCloseUpdate(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('cash-close-update', {
        ...data,
        restaurantId: this.restaurantId
      });
    }
  }

  // Remover todos los listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socket: this.socket
    };
  }
}

export default new SocketService();
