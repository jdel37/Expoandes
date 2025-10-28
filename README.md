# 🍽️ Restaurante Manager

Sistema completo de gestión para restaurantes con React Native, MongoDB y tiempo real.

## ✨ Características

### 📱 Frontend (React Native + Expo)
- **Diseño moderno** con componentes reutilizables
- **Navegación fluida** entre pantallas
- **Tiempo real** con Socket.io
- **Persistencia local** con AsyncStorage
- **Animaciones suaves** y UX optimizada

### 🚀 Backend (Node.js + Express + MongoDB)
- **API REST completa** con validación
- **Base de datos MongoDB** con Mongoose
- **Autenticación JWT** con roles
- **Tiempo real** con Socket.io
- **Analytics avanzados** y proyecciones
- **Seguridad robusta** con rate limiting

### 🎯 Funcionalidades Principales

#### 📦 Gestión de Inventario
- ✅ Agregar, editar y eliminar productos
- ✅ Control de stock en tiempo real
- ✅ Categorización y proveedores
- ✅ Alertas de stock bajo
- ✅ Actualización de cantidades

#### 🛒 Gestión de Pedidos
- ✅ Crear pedidos con múltiples items
- ✅ Estados: Pendiente → En Proceso → Entregado
- ✅ Tipos: Comer aquí, Para llevar, Domicilio
- ✅ Control de pagos y métodos
- ✅ Actualizaciones en tiempo real

#### 💰 Cierre de Caja
- ✅ Apertura y cierre por turnos
- ✅ Control de efectivo vs ventas
- ✅ Cálculo automático de diferencias
- ✅ Gestión de gastos
- ✅ Verificación de cierres

#### 📊 Analytics y Reportes
- ✅ Dashboard con métricas clave
- ✅ Análisis de ventas por período
- ✅ Proyecciones y tendencias
- ✅ Reportes de inventario
- ✅ Estadísticas de pedidos

#### ⚙️ Configuración
- ✅ Gestión de usuarios y roles
- ✅ Preferencias de usuario
- ✅ Configuración del restaurante
- ✅ Sincronización de datos

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 16+
- MongoDB 4.4+
- Expo CLI
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd restaurante-manager
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp config.env.example config.env
# Editar config.env con tus configuraciones
```

### 3. Iniciar Backend
```bash
# Opción 1: Script automático
./start-backend.sh

# Opción 2: Manual
mongod
npm run dev
```

### 4. Configurar Frontend
```bash
cd .. # Volver al directorio raíz
npm install
```

### 5. Iniciar Frontend
```bash
npm start
# o
expo start
```

## 📱 Uso de la Aplicación

### Primer Uso
1. **Registrarse** - Crear cuenta de administrador
2. **Configurar restaurante** - Datos básicos
3. **Agregar inventario** - Productos iniciales
4. **Abrir caja** - Iniciar turno

### Flujo Diario
1. **Abrir caja** - Dinero inicial
2. **Tomar pedidos** - Crear órdenes
3. **Gestionar inventario** - Actualizar stock
4. **Cerrar caja** - Reconciliación final

## 🗄️ Estructura de la Base de Datos

### Usuarios
- Información personal y autenticación
- Roles: admin, manager, employee
- Preferencias de usuario

### Restaurante
- Datos del negocio
- Configuraciones y horarios
- Información de contacto

### Inventario
- Productos y stock
- Precios y categorías
- Proveedores

### Pedidos
- Órdenes de clientes
- Items y totales
- Estados y pagos

### Cierre de Caja
- Turnos y cierres
- Control de efectivo
- Gastos y verificaciones

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/restaurante_manager

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secret_muy_seguro
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

### Personalización
- **Colores**: `src/theme/colors.js`
- **Componentes**: `src/components/`
- **Pantallas**: `src/screens/`
- **API**: `src/services/apiService.js`

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Inventario
- `GET /api/inventory` - Listar productos
- `POST /api/inventory` - Crear producto
- `PUT /api/inventory/:id` - Actualizar
- `DELETE /api/inventory/:id` - Eliminar

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido
- `PUT /api/orders/:id/status` - Cambiar estado

### Cierre de Caja
- `POST /api/cash-close` - Abrir caja
- `PUT /api/cash-close/:id/close` - Cerrar caja
- `GET /api/cash-close/current` - Caja actual

### Analytics
- `GET /api/analytics/dashboard` - Dashboard
- `GET /api/analytics/sales` - Ventas
- `GET /api/analytics/projections` - Proyecciones

## 🔄 Tiempo Real

La aplicación usa Socket.io para actualizaciones en tiempo real:

- **Inventario** - Cambios en stock
- **Pedidos** - Nuevos pedidos y estados
- **Cierre de caja** - Actualizaciones de caja

## 🛡️ Seguridad

- **JWT** para autenticación
- **Rate limiting** para prevenir abuso
- **Validación** de datos de entrada
- **CORS** configurado
- **Helmet** para headers de seguridad

## 📱 Despliegue

### Backend
1. Configurar servidor MongoDB
2. Variables de entorno de producción
3. Usar PM2 para gestión de procesos
4. Configurar reverse proxy (nginx)

### Frontend
1. Build para producción
2. Subir a App Store/Play Store
3. Configurar notificaciones push
4. Analytics de uso

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/restaurante-manager/issues)
- **Documentación**: [Wiki](https://github.com/tu-usuario/restaurante-manager/wiki)
- **Email**: soporte@restaurante-manager.com

## 🎉 Agradecimientos

- React Native Community
- Expo Team
- MongoDB Team
- Socket.io Team
- Todos los contribuidores

---

**¡Disfruta gestionando tu restaurante! 🍽️✨**
