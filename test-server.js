// Script simple para probar el servidor
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware básico
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/restaurante_manager')
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    
    // Iniciar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });
