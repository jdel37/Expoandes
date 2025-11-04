// Configuración de red para Restaurante Manager
// Actualizada automáticamente el Tue Nov  4 09:45:43 -05 2025

export const NETWORK_CONFIG = {
  // IP local de tu computadora
  LOCAL_IP: '157.253.252.62',
  
  // Puerto del backend
  BACKEND_PORT: 3001,
  
  // Puerto del frontend (Expo)
  FRONTEND_PORT: 8082,
  
  // URLs completas
  API_BASE_URL: `http://157.253.252.62:3001/api`,
  SOCKET_URL: `http://157.253.252.62:3001`,
  FRONTEND_URL: `http://157.253.252.62:8082`
};

// Para obtener tu IP actual, ejecuta en terminal:
// ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print }'
