#!/bin/bash

# 🚀 Script para iniciar todo el sistema Restaurante Manager
# Este script maneja MongoDB, Backend y Frontend de forma automática

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}  🍽️  RESTAURANTE MANAGER  🍽️${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo ""
}

# Función para limpiar procesos anteriores
cleanup_processes() {
    print_status "🧹 Limpiando procesos anteriores..."
    
    # Matar procesos en puertos específicos
    lsof -ti:27017 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    lsof -ti:19006 | xargs kill -9 2>/dev/null || true
    
    # Matar procesos específicos
    pkill -f "mongod" 2>/dev/null || true
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    
    sleep 2
    print_success "Procesos anteriores limpiados"
}

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Puerto en uso
    else
        return 1  # Puerto libre
    fi
}

# Función para esperar que un servicio esté listo
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    print_status "⏳ Esperando que $service_name esté listo..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            print_success "$service_name está listo!"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name no respondió después de $max_attempts segundos"
    return 1
}

# Función para crear directorios necesarios
create_directories() {
    print_status "📁 Creando directorios necesarios..."
    
    mkdir -p data/db
    mkdir -p logs
    mkdir -p backend/logs
    
    print_success "Directorios creados"
}

# Función para verificar dependencias
check_dependencies() {
    print_status "🔍 Verificando dependencias..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado"
        exit 1
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado"
        exit 1
    fi
    
    # Verificar MongoDB (opcional, puede estar instalado localmente)
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB no encontrado en PATH, intentando usar instalación local..."
    fi
    
    print_success "Dependencias verificadas"
}

# Función para instalar dependencias del backend
install_backend_deps() {
    print_status "📦 Instalando dependencias del backend..."
    
    cd backend
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependencias del backend instaladas"
    else
        print_success "Dependencias del backend ya están instaladas"
    fi
    
    cd ..
}

# Función para instalar dependencias del frontend
install_frontend_deps() {
    print_status "📦 Instalando dependencias del frontend..."
    
    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependencias del frontend instaladas"
    else
        print_success "Dependencias del frontend ya están instaladas"
    fi
}

# Función para iniciar MongoDB
start_mongodb() {
    print_status "🍃 Iniciando MongoDB..."
    
    # Verificar si MongoDB ya está corriendo
    if check_port 27017; then
        print_warning "MongoDB ya está corriendo en puerto 27017"
        return 0
    fi
    
    # Crear directorio de datos si no existe
    mkdir -p data/db
    
    # Intentar iniciar MongoDB
    if command -v mongod &> /dev/null; then
        # MongoDB está en PATH
        mongod --dbpath data/db --logpath logs/mongodb.log --fork --port 27017 --bind_ip 127.0.0.1
    else
        # Intentar con rutas comunes de macOS
        if [ -f "/usr/local/bin/mongod" ]; then
            /usr/local/bin/mongod --dbpath data/db --logpath logs/mongodb.log --fork --port 27017 --bind_ip 127.0.0.1
        elif [ -f "/opt/homebrew/bin/mongod" ]; then
            /opt/homebrew/bin/mongod --dbpath data/db --logpath logs/mongodb.log --fork --port 27017 --bind_ip 127.0.0.1
        else
            print_error "No se pudo encontrar MongoDB. Por favor instálalo:"
            print_error "brew install mongodb-community"
            exit 1
        fi
    fi
    
    # Esperar a que MongoDB esté listo
    sleep 3
    
    if check_port 27017; then
        print_success "MongoDB iniciado correctamente"
    else
        print_error "Error al iniciar MongoDB"
        exit 1
    fi
}

# Función para iniciar el backend
start_backend() {
    print_status "⚙️ Iniciando backend..."
    
    # Verificar si el backend ya está corriendo
    if check_port 3001; then
        print_warning "Backend ya está corriendo en puerto 3001"
        return 0
    fi
    
    cd backend
    
    # Iniciar el servidor en background
    nohup node server.js > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    
    cd ..
    
    # Esperar a que el backend esté listo
    if wait_for_service "http://localhost:3001/api/health" "Backend"; then
        print_success "Backend iniciado correctamente (PID: $BACKEND_PID)"
    else
        print_error "Error al iniciar el backend"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
}

# Función para iniciar el frontend
start_frontend() {
    print_status "📱 Iniciando frontend..."
    
    # Verificar si Expo está instalado globalmente
    if ! command -v expo &> /dev/null; then
        print_status "Instalando Expo CLI globalmente..."
        npm install -g @expo/cli
    fi
    
    # Iniciar Expo en background
    nohup npx expo start --clear > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    print_success "Frontend iniciado correctamente (PID: $FRONTEND_PID)"
    print_status "📱 Escanea el código QR con la app Expo Go"
    print_status "🌐 O abre http://localhost:19006 en tu navegador"
}

# Función para mostrar el estado del sistema
show_status() {
    echo ""
    print_header
    print_status "📊 Estado del sistema:"
    echo ""
    
    # MongoDB
    if check_port 27017; then
        print_success "🍃 MongoDB: ✅ Corriendo en puerto 27017"
    else
        print_error "🍃 MongoDB: ❌ No está corriendo"
    fi
    
    # Backend
    if check_port 3001; then
        print_success "⚙️ Backend: ✅ Corriendo en puerto 3001"
        print_status "🔗 API: http://localhost:3001/api"
    else
        print_error "⚙️ Backend: ❌ No está corriendo"
    fi
    
    # Frontend
    if check_port 19006; then
        print_success "📱 Frontend: ✅ Corriendo en puerto 19006"
        print_status "🌐 Web: http://localhost:19006"
    else
        print_warning "📱 Frontend: ⏳ Iniciando..."
    fi
    
    echo ""
    print_status "📝 Logs disponibles en:"
    print_status "   - MongoDB: logs/mongodb.log"
    print_status "   - Backend: logs/backend.log"
    print_status "   - Frontend: logs/frontend.log"
    echo ""
}

# Función para manejar la salida del script
cleanup_on_exit() {
    echo ""
    print_warning "🛑 Deteniendo servicios..."
    
    # Matar procesos específicos
    pkill -f "node.*server.js" 2>/dev/null || true
    pkill -f "expo start" 2>/dev/null || true
    
    print_success "Servicios detenidos"
    exit 0
}

# Configurar trap para manejar Ctrl+C
trap cleanup_on_exit INT TERM

# Función principal
main() {
    print_header
    
    # Verificar que estamos en el directorio correcto
    if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
        print_error "Este script debe ejecutarse desde el directorio raíz del proyecto"
        exit 1
    fi
    
    # Ejecutar pasos en orden
    cleanup_processes
    create_directories
    check_dependencies
    install_backend_deps
    install_frontend_deps
    start_mongodb
    start_backend
    start_frontend
    
    # Mostrar estado final
    show_status
    
    print_success "🎉 ¡Sistema iniciado completamente!"
    print_status "Presiona Ctrl+C para detener todos los servicios"
    
    # Mantener el script corriendo
    while true; do
        sleep 10
        
        # Verificar que los servicios sigan corriendo
        if ! check_port 27017; then
            print_error "MongoDB se detuvo inesperadamente"
            break
        fi
        
        if ! check_port 3001; then
            print_error "Backend se detuvo inesperadamente"
            break
        fi
    done
}

# Ejecutar función principal
main "$@"
