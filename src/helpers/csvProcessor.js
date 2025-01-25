// src/helpers/csvProcessor.js
const Papa = require('papaparse');

/**
 * Parsea el contenido de un Buffer (ej. req.file.buffer)
 * que contiene datos CSV. Retorna un array de objetos,
 * donde las claves de los objetos corresponden a los
 * nombres de las columnas del CSV (gracias a header: true).
 */
function parseCsvBuffer(buffer) {
  // Convierte el buffer a string (UTF-8)
  const csvData = buffer.toString('utf-8');

  // Usa papaparse para parsear
  const parsed = Papa.parse(csvData, { header: true });

  // parsed.data es un array de objetos, uno por cada fila (ignora la última vacía si la hubiera)
  return parsed.data;
}

/**
 * Construye un array de preguntas listo para insertar en la tabla "questions".
 * @param {Array} rawData - array de objetos proveniente de parseCsvBuffer
 * @param {string} examId - el ID del examen al que asociar las preguntas
 * @returns {Array} un array de objetos con las propiedades que maneja tu BD
 */
function buildQuestionsArray(rawData, examId) {
  // Ajusta las propiedades en función de tus columnas de CSV y la estructura de 'questions'
  return rawData.map((row) => ({
    exam_id: examId,
    text: row.text,
    option_a: row.option_a,
    option_b: row.option_b,
    option_c: row.option_c,
    correct_option: row.correct_option,
    topic: row.topic,
    feedback: row.feedback || '',  // si en tu CSV existe la columna 'feedback'
  }));
}

module.exports = {
  parseCsvBuffer,
  buildQuestionsArray,
};
