#!/bin/bash

# 🔧 Script para actualizar la IP local automáticamente
# Este script obtiene tu IP local y actualiza la configuración

echo "🔍 Obteniendo IP local..."

# Obtener IP local
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

if [ -z "$LOCAL_IP" ]; then
    echo "❌ No se pudo obtener la IP local"
    exit 1
fi

echo "✅ IP local encontrada: $LOCAL_IP"

# Actualizar archivo de configuración
echo "📝 Actualizando configuración..."

cat > src/config/network.js << EOF
// Configuración de red para Restaurante Manager
// Actualizada automáticamente el $(date)

export const NETWORK_CONFIG = {
  // IP local de tu computadora
  LOCAL_IP: '$LOCAL_IP',
  
  // Puerto del backend
  BACKEND_PORT: 3001,
  
  // Puerto del frontend (Expo)
  FRONTEND_PORT: 8082,
  
  // URLs completas
  API_BASE_URL: \`http://$LOCAL_IP:3001/api\`,
  SOCKET_URL: \`http://$LOCAL_IP:3001\`,
  FRONTEND_URL: \`http://$LOCAL_IP:8082\`
};

// Para obtener tu IP actual, ejecuta en terminal:
// ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'
EOF

echo "✅ Configuración actualizada con IP: $LOCAL_IP"
echo ""
echo "📱 URLs actualizadas:"
echo "   - API: http://$LOCAL_IP:3001/api"
echo "   - Socket: http://$LOCAL_IP:3001"
echo "   - Frontend: http://$LOCAL_IP:8082"
echo ""
echo "🔄 Reinicia el sistema para aplicar los cambios:"
echo "   ./stop-everything.sh && ./start-all.sh"
