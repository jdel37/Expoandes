#!/bin/bash

# 🚀 Script SIMPLE para iniciar todo rápidamente
# Para casos donde necesitas iniciar todo sin verificaciones complejas

echo "🚀 Iniciando Restaurante Manager..."

# Limpiar procesos anteriores
echo "🧹 Limpiando procesos anteriores..."
pkill -f "mongod" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "expo start" 2>/dev/null || true
lsof -ti:27017 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:19006 | xargs kill -9 2>/dev/null || true

sleep 2

# Crear directorios
mkdir -p data/db logs

# Iniciar MongoDB
echo "🍃 Iniciando MongoDB..."
mongod --dbpath data/db --logpath logs/mongodb.log --fork --port 27017 --bind_ip 127.0.0.1 &
sleep 3

# Iniciar Backend
echo "⚙️ Iniciando Backend..."
cd backend
node server.js &
cd ..
sleep 3

# Iniciar Frontend
echo "📱 Iniciando Frontend..."
npx expo start --clear &

echo ""
echo "✅ ¡Todo iniciado!"
echo "📱 Frontend: http://localhost:19006"
echo "⚙️ Backend: http://localhost:3001"
echo "🍃 MongoDB: puerto 27017"
echo ""
echo "Presiona Ctrl+C para detener todo"

# Mantener corriendo
wait
