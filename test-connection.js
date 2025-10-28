// Script de prueba para verificar la conexión a MongoDB
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    
    await mongoose.connect('mongodb://localhost:27017/restaurante_manager', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Conectado a MongoDB');
    
    // Verificar la base de datos
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('📊 Colecciones encontradas:', collections.map(c => c.name));
    
    // Probar una operación simple
    const result = await db.admin().ping();
    console.log('🏓 Ping exitoso:', result);
    
    console.log('🎉 ¡Conexión exitosa!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado');
  }
}

testConnection();
