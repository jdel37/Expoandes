#!/bin/bash

# 🚀 Script FINAL para iniciar todo el sistema Restaurante Manager
# Optimizado para macOS - Sin flags problemáticos

echo "🍽️  RESTAURANTE MANAGER - INICIO COMPLETO"
echo "========================================"
echo ""

# Función para limpiar procesos anteriores
cleanup() {
    echo "🧹 Limpiando procesos anteriores..."
    pkill -f "mongod" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    lsof -ti:27017 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    lsof -ti:8082 | xargs kill -9 2>/dev/null || true
    sleep 2
    echo "✅ Limpieza completada"
}

# Función para crear directorios
setup_dirs() {
    echo "📁 Preparando directorios..."
    mkdir -p data/db logs
    echo "✅ Directorios listos"
}

# Función para iniciar MongoDB
start_mongodb() {
    echo "🍃 Iniciando MongoDB..."
    
    # Verificar si MongoDB está disponible
    if ! command -v mongod &> /dev/null; then
        echo "❌ MongoDB no encontrado. Instálalo con: brew install mongodb-community"
        exit 1
    fi
    
    # Iniciar MongoDB (sin --fork para macOS)
    mongod --dbpath data/db --logpath logs/mongodb.log --port 27017 --bind_ip 127.0.0.1 &
    MONGO_PID=$!
    
    # Esperar a que MongoDB esté listo
    echo "⏳ Esperando MongoDB..."
    sleep 5
    
    if lsof -i :27017 >/dev/null 2>&1; then
        echo "✅ MongoDB iniciado (PID: $MONGO_PID)"
    else
        echo "❌ Error al iniciar MongoDB"
        exit 1
    fi
}

# Función para iniciar Backend
start_backend() {
    echo "⚙️ Iniciando Backend..."
    
    cd backend
    
    # Verificar dependencias
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias del backend..."
        npm install
    fi
    
    # Iniciar servidor
    node server.js &
    BACKEND_PID=$!
    
    cd ..
    
    # Esperar a que el backend esté listo
    echo "⏳ Esperando Backend..."
    sleep 5
    
    if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
        echo "✅ Backend iniciado (PID: $BACKEND_PID)"
    else
        echo "❌ Error al iniciar Backend"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
}

# Función para iniciar Frontend
start_frontend() {
    echo "📱 Iniciando Frontend..."
    
    # Verificar dependencias
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias del frontend..."
        npm install
    fi
    
    # Iniciar Expo
    npx expo start --clear --port 8082 &
    FRONTEND_PID=$!
    
    echo "✅ Frontend iniciado (PID: $FRONTEND_PID)"
}

# Función para mostrar estado
show_status() {
    echo ""
    echo "🎉 ¡SISTEMA INICIADO COMPLETAMENTE!"
    echo "=================================="
    echo ""
    echo "📊 Servicios activos:"
    echo "🍃 MongoDB:    puerto 27017"
    echo "⚙️ Backend:     http://localhost:3001"
    echo "📱 Frontend:    http://localhost:8082"
    echo ""
    echo "📝 Logs disponibles en:"
    echo "   - MongoDB: logs/mongodb.log"
    echo "   - Backend: logs/backend.log (si existe)"
    echo ""
    echo "🛑 Para detener todo: ./stop-everything.sh"
    echo "📱 Escanea el QR con Expo Go o abre http://localhost:8082"
    echo ""
}

# Función para manejar Ctrl+C
cleanup_on_exit() {
    echo ""
    echo "🛑 Deteniendo servicios..."
    pkill -f "mongod" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    echo "✅ Servicios detenidos"
    exit 0
}

# Configurar trap para Ctrl+C
trap cleanup_on_exit INT TERM

# Ejecutar secuencia de inicio
cleanup
setup_dirs
start_mongodb
start_backend
start_frontend
show_status

# Mantener el script corriendo
echo "Presiona Ctrl+C para detener todos los servicios"
while true; do
    sleep 10
done