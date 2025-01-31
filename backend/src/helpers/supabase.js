// src/helpers/supabase.js
const { createClient } = require('@supabase/supabase-js');

// Cargar dotenv solo en entornos distintos de producción
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Leer las variables de entorno
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Validar que las variables estén definidas
if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL y SUPABASE_SERVICE_KEY son obligatorias.');
}

// Crear la instancia del cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };