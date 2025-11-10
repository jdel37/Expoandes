// Configuración de red para Restaurante Manager
// Actualizada automáticamente el Sun Nov  9 01:56:56 -05 2025

export const NETWORK_CONFIG = {
  // IP local de tu computadora
  LOCAL_IP: '192.168.20.31',
  
  // Puerto del backend
  BACKEND_PORT: 3001,
  
  // Puerto del frontend (Expo)
  FRONTEND_PORT: 8082,
  
  // URLs completas
  API_BASE_URL: `https://expoandes-backend-git-main-jdel37s-projects.vercel.app/api`,
  SOCKET_URL: `https://expoandes-backend-git-main-jdel37s-projects.vercel.app/api`,
  FRONTEND_URL: `https://YOUR_FRONTEND_VERCEL_URL.vercel.app`
};

// Para obtener tu IP actual, ejecuta en terminal:
// ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print }'
