#!/bin/bash

# Script para iniciar el backend del Restaurante Manager

echo "🚀 Iniciando Backend del Restaurante Manager..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 16+"
    exit 1
fi

# Verificar si MongoDB está instalado
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB no está instalado. Por favor instala MongoDB 4.4+"
    exit 1
fi

# Navegar al directorio del backend
cd backend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar si MongoDB está ejecutándose
if ! pgrep -x "mongod" > /dev/null; then
    echo "🗄️ Iniciando MongoDB..."
    mongod --dbpath ./data/db &
    sleep 3
fi

# Verificar si el archivo de configuración existe
if [ ! -f "config.env" ]; then
    echo "⚙️ Creando archivo de configuración..."
    cat > config.env << EOL
# Database
MONGODB_URI=mongodb://localhost:27017/restaurante_manager
MONGODB_TEST_URI=mongodb://localhost:27017/restaurante_manager_test

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=restaurante_manager_jwt_secret_2024_very_secure_key
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
EOL
fi

echo "✅ Configuración completada"
echo "🌐 Iniciando servidor en puerto 5000..."
echo "📊 Dashboard: http://localhost:5000/api/health"
echo "🔌 Socket.io habilitado para tiempo real"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Iniciar el servidor
npm run dev
