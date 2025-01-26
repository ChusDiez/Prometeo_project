// src/controllers/auth.controller.js

const { supabase } = require('../helpers/supabase');
const { subscribeToNewsletter } = require('../helpers/brevo');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y password son obligatorios',
      });
    }

    // 1) Llamamos a supabase.auth.signUp
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Opcional: podemos pasar "options" con data adicional
      options: {
        data: {
          // Si quieres guardar "name" en "user_metadata" o algo similar
          name: name || '',
        },
        emailRedirectTo: 'https://tusitio.com/confirmacion', // Por si envías email de confirmación
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // data.user contendrá la info del usuario creado
    const newUser = data.user;
    if (!newUser) {
      return res.status(500).json({ error: 'No se pudo crear el usuario en Supabase' });
    }

    // 2) Suscribir el email a la newsletter de Brevo
    //    (Sólo si deseas que todos los registrados estén en tu lista)
    if (email) {
      try {
        await subscribeToNewsletter(email, name);
      } catch (brevoError) {
        console.error('Error al suscribir a Brevo', brevoError.message);
        // Podrías decidir ignorar este error o devolver al cliente que falló la suscripción
      }
    }

    // 3) Responder con los datos del usuario o un mensaje
    return res.json({
      message: 'Registro exitoso',
      user: {
        id: newUser.id,
        email: newUser.email,
        // name se guardó en "user_metadata" o se sincronizará en tu tabla 'users'
      },
      session: data.session, // puede ser null si configuras confirmación por email
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno en register' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y password son obligatorios',
      });
    }

    // 1) Llamamos a supabase.auth.signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    // data tiene .user y .session
    const { user, session } = data;

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2) Devuelves la sesión al front para que guarde el token
    //    (o uses cookies, según tu estrategia)
    return res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
      },
      session, // { access_token, refresh_token, etc. }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno en login' });
  }
};
