#!/bin/bash

# Script para iniciar MongoDB para Restaurante Manager

echo "🗄️ Iniciando MongoDB para Restaurante Manager..."

# Verificar si MongoDB está instalado
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB no está instalado. Instalando con Homebrew..."
    
    # Instalar Homebrew si no existe
    if ! command -v brew &> /dev/null; then
        echo "📦 Instalando Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Instalar MongoDB
    echo "📦 Instalando MongoDB..."
    brew tap mongodb/brew
    brew install mongodb-community
fi

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p data/db
mkdir -p logs

# Dar permisos correctos
echo "🔐 Configurando permisos..."
chmod 755 data/db
chmod 755 logs

# Verificar si MongoDB ya está corriendo
if pgrep -x "mongod" > /dev/null; then
    echo "⚠️ MongoDB ya está corriendo. Deteniendo proceso anterior..."
    pkill mongod
    sleep 2
fi

# Iniciar MongoDB con configuración personalizada
echo "🚀 Iniciando MongoDB con configuración personalizada..."
mongod --config mongod.conf &
MONGOD_PID=$!

# Verificar que MongoDB esté corriendo
sleep 3
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB iniciado exitosamente!"
    echo "📍 Puerto: 27017"
    echo "📁 Base de datos: data/db"
    echo "📝 Logs: logs/mongodb.log"
    echo ""
    echo "🔍 Para verificar la conexión:"
    echo "   mongo --eval 'db.runCommand({connectionStatus: 1})'"
    echo ""
    echo "🛑 Para detener MongoDB:"
    echo "   pkill mongod"
else
    echo "❌ Error al iniciar MongoDB. Revisa los logs en logs/mongodb.log"
    exit 1
fi
