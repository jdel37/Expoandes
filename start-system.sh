#!/bin/bash

echo "🍽️ Iniciando Restaurante Manager - Sistema Completo"
echo "=================================================="

# Función de limpieza
cleanup() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    pkill -f mongod 2>/dev/null
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f nodemon 2>/dev/null
    echo "✅ Servicios detenidos"
    exit 0
}

trap cleanup SIGINT

# 1. Limpiar procesos existentes
echo "🧹 Limpiando procesos existentes..."
pkill -f mongod 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null
pkill -f nodemon 2>/dev/null
sleep 2

# 2. Iniciar MongoDB
echo "🗄️ Iniciando MongoDB..."
mongod --dbpath ./data/db --logpath ./logs/mongodb.log &
MONGOD_PID=$!
sleep 3

# Verificar MongoDB
if ! pgrep -x "mongod" > /dev/null; then
    echo "❌ Error al iniciar MongoDB"
    exit 1
fi
echo "✅ MongoDB iniciado"

# 3. Iniciar Backend
echo "🔧 Iniciando Backend..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend esté listo..."
sleep 8

# Verificar backend
if ! curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "❌ Error al iniciar el backend"
    echo "💡 Verificando logs..."
    ps aux | grep "node server.js" | grep -v grep
    exit 1
fi

echo "✅ Backend iniciado en puerto 5000"

# 4. Mostrar información
echo ""
echo "🎉 ¡Sistema iniciado exitosamente!"
echo "=================================="
echo "🗄️ MongoDB:     localhost:27017"
echo "🔧 Backend:     http://localhost:5000"
echo "📊 Health:      http://localhost:5000/api/health"
echo ""
echo "🛑 Para detener: Ctrl+C"
echo ""

# Mantener script corriendo
wait
