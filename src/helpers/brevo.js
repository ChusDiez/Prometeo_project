// src/helpers/brevo.js

const axios = require('axios');

/**
 * Suscribe un usuario a la newsletter en Brevo (Sendinblue)
 * @param {string} email - Email del usuario que se suscribe
 * @param {string} name  - Nombre (opcional) para guardar en la lista
 * @param {number} listId - ID de la lista de Brevo a la que se añade el usuario
 * @returns {Promise<void>} - Lanza error si falla
 */
async function subscribeToNewsletter(email, name, listId) {
  try {
    // Endpoint de la API de Brevo
    const url = 'https://api.brevo.com/v3/contacts';

    // Cuerpo de la solicitud
    const body = {
      email,
      attributes: {
        NAME: name,
      },
      listIds: [listId],
      updateEnabled: true, // Permite actualizar datos si el contacto ya existe
    };

    // Obtiene la API key desde las variables de entorno
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      throw new Error('La API key de Brevo no está configurada en las variables de entorno (BREVO_API_KEY).');
    }

    // Configuración de los headers
    const headers = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'api-key': brevoApiKey,
    };

    // Realiza la solicitud POST a la API
    const response = await axios.post(url, body, { headers });

    console.log(`Usuario ${email} suscrito correctamente a la newsletter de Brevo.`, response.data);
  } catch (error) {
    console.error('Error suscribiendo a Brevo:', error.response?.data || error.message);
    throw new Error(`Error suscribiendo a la newsletter: ${error.response?.data?.message || error.message}`);
  }
}

module.exports = { subscribeToNewsletter };