// Configuración de red para Restaurante Manager
// Actualiza esta IP cuando cambies de red

export const NETWORK_CONFIG = {
  // IP local de tu computadora (obtener con: ifconfig | grep "inet " | grep -v 127.0.0.1)
  LOCAL_IP: '192.168.20.26',
  
  // Puerto del backend
  BACKEND_PORT: 3001,
  
  // Puerto del frontend (Expo)
  FRONTEND_PORT: 8082,
  
  // URLs completas
  API_BASE_URL: `http://192.168.20.26:3001/api`,
  SOCKET_URL: `http://192.168.20.26:3001`,
  FRONTEND_URL: `http://192.168.20.26:8082`
};

// Para obtener tu IP actual, ejecuta en terminal:
// ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
