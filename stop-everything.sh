#!/bin/bash

# 🛑 Script para detener todos los servicios del Restaurante Manager

echo "🛑 Deteniendo Restaurante Manager..."

# Detener procesos específicos
echo "📱 Deteniendo Frontend (Expo)..."
pkill -f "expo start" 2>/dev/null || echo "Frontend ya estaba detenido"

echo "⚙️ Deteniendo Backend..."
pkill -f "node.*server.js" 2>/dev/null || echo "Backend ya estaba detenido"

echo "🍃 Deteniendo MongoDB..."
pkill -f "mongod" 2>/dev/null || echo "MongoDB ya estaba detenido"

# Limpiar puertos específicos
echo "🧹 Limpiando puertos..."
lsof -ti:19006 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:27017 | xargs kill -9 2>/dev/null || true

echo ""
echo "✅ Todos los servicios han sido detenidos"
echo "🔍 Verificando puertos..."

# Verificar que los puertos estén libres
if lsof -Pi :19006 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️ Puerto 19006 aún en uso"
else
    echo "✅ Puerto 19006 libre"
fi

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️ Puerto 3001 aún en uso"
else
    echo "✅ Puerto 3001 libre"
fi

if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️ Puerto 27017 aún en uso"
else
    echo "✅ Puerto 27017 libre"
fi

echo ""
echo "🎉 Sistema completamente detenido"
