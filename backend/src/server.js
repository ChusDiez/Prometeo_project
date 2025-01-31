require('dotenv').config();          // Carga variables de entorno
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const app = express();
const adminRoutes = require('./routes/admin.routes');

app.use(cors({origin: 'http://localhost:3001'}));
app.use(express.json());            // Para parsear JSON en requests

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);

// ... otras rutas

// Arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
