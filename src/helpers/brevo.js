// src/services/brevo.service.js

const axios = require('axios');

/**
 * Suscribe un usuario a la newsletter en Brevo (Sendinblue)
 * @param {string} email - Email del usuario que se suscribe
 * @param {string} name  - Nombre (opcional) para guardar en la lista
 * @returns {Promise<void>} - Lanza error si falla
 */
async function subscribeToNewsletter(email, name) {
  try {
    // Ajusta la URL según la versión de la API de Brevo que uses
    const url = 'https://api.brevo.com/v3/contacts';

    // Ejemplo: para añadir a una lista con ID 12 (p.e.)
    // Ajusta "listIds" con el ID de tu lista en Brevo
    const body = {
      email,
      attributes: {
        NAME: name,
      },
      listIds: [12],
      updateEnabled: true
    };

    // Asegúrate de tener la API key de Brevo en tu .env
    const brevoApiKey = process.env.BREVO_API_KEY;

    const headers = {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'api-key': brevoApiKey,
    };

    await axios.post(url, body, { headers });

    console.log(`Usuario ${email} suscrito correctamente a la newsletter de Brevo.`);
  } catch (error) {
    console.error('Error suscribiendo a Brevo:', error.response?.data || error.message);
    throw new Error(`Error suscribiendo a la newsletter: ${error.message}`);
  }
}

module.exports = { subscribeToNewsletter };
