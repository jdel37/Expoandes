// Script de inicialización de la base de datos para Restaurante Manager
const mongoose = require('mongoose');

// Configuración de conexión
const MONGODB_URI = 'mongodb://localhost:27017/restaurante_manager';

// Conectar a MongoDB
async function initDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');
    
    // Crear la base de datos si no existe
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Colecciones existentes:', collections.map(c => c.name));
    
    // Crear índices para optimizar consultas
    console.log('🔍 Creando índices...');
    
    // Índices para usuarios
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ restaurant: 1 });
    
    // Índices para restaurantes
    await db.collection('restaurants').createIndex({ name: 1 });
    await db.collection('restaurants').createIndex({ 'contact.email': 1 });
    
    // Índices para inventario
    await db.collection('inventoryitems').createIndex({ restaurant: 1, category: 1 });
    await db.collection('inventoryitems').createIndex({ restaurant: 1, isActive: 1 });
    await db.collection('inventoryitems').createIndex({ sku: 1 }, { sparse: true });
    
    // Índices para pedidos
    await db.collection('orders').createIndex({ restaurant: 1, status: 1 });
    await db.collection('orders').createIndex({ restaurant: 1, createdAt: -1 });
    await db.collection('orders').createIndex({ orderNumber: 1 }, { unique: true });
    await db.collection('orders').createIndex({ 'customer.name': 1 });
    
    // Índices para cierre de caja
    await db.collection('cashcloses').createIndex({ restaurant: 1, date: -1 });
    await db.collection('cashcloses').createIndex({ restaurant: 1, status: 1 });
    await db.collection('cashcloses').createIndex({ openedBy: 1 });
    
    console.log('✅ Índices creados exitosamente');
    
    // Verificar conexión
    const admin = db.admin();
    const serverStatus = await admin.serverStatus();
    
    console.log('📈 Estado del servidor:');
    console.log(`   - Versión: ${serverStatus.version}`);
    console.log(`   - Uptime: ${Math.floor(serverStatus.uptime / 60)} minutos`);
    console.log(`   - Conexiones: ${serverStatus.connections.current}`);
    
    console.log('🎉 Base de datos inicializada correctamente!');
    
  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar inicialización
initDatabase();
