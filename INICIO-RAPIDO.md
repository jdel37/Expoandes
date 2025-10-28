# 🍽️ Restaurante Manager - Guía de Inicio

## 🚀 Inicio Rápido

### Opción 1: Script Completo (Recomendado)
```bash
./start-all.sh
```

### Opción 2: Script Simple
```bash
./quick-start.sh
```

### Opción 3: Script Detallado
```bash
./start-everything.sh
```

## 🛑 Detener Todo
```bash
./stop-everything.sh
```

## 📊 Servicios

Una vez iniciado, tendrás:

- **🍃 MongoDB**: puerto 27017
- **⚙️ Backend**: http://localhost:3001
- **📱 Frontend**: http://localhost:8082

## 🔧 Solución de Problemas

### Error: Puerto en uso
```bash
./stop-everything.sh
./start-all.sh
```

### Error: MongoDB no encontrado
```bash
brew install mongodb-community
```

### Error: Dependencias faltantes
```bash
cd backend && npm install
npm install
```

## 📱 Uso de la App

1. **Escanea el QR** con la app Expo Go
2. **O abre** http://localhost:8082 en tu navegador
3. **Regístrate** o inicia sesión
4. **¡Empieza a usar** todas las funcionalidades!

## 🎯 Funcionalidades Disponibles

- ✅ **Inventario**: Agregar, editar, eliminar productos
- ✅ **Órdenes**: Crear y gestionar pedidos
- ✅ **Cierre de Caja**: Contar dinero y calcular diferencias
- ✅ **Proyecciones**: Ver estadísticas y gráficos
- ✅ **TPH**: Análisis de transacciones por hora
- ✅ **Configuración**: Notificaciones, idioma, tema

## 📝 Logs

- MongoDB: `logs/mongodb.log`
- Backend: `logs/backend.log`
- Frontend: Se muestra en la terminal

## 🆘 Soporte

Si tienes problemas:

1. Ejecuta `./stop-everything.sh`
2. Ejecuta `./start-all.sh`
3. Verifica que todos los puertos estén libres
4. Revisa los logs para errores específicos

¡Disfruta usando Restaurante Manager! 🎉
