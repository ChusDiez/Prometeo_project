// src/models/user.model.js
const { supabase } = require('../helpers/supabase');

class UserModel {
  /**
   * Crea un nuevo usuario en la tabla 'users'
   * (asumiendo que la fila en auth.users ya existe o la creas con supabase.auth.signUp).
   * 'id' debe coincidir con el uuid de auth.users.
   */
  static async createUser({ id, name, email }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ id, name, email }]);

    if (error) {
      throw new Error(error.message);
    }

    return data[0]; // Devuelve el registro recién insertado
  }

  /**
   * Obtiene un usuario por su email (retorna null si no existe).
   */
  static async getUserByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      // Algunas versiones devuelven error si no encuentra fila
      if (error.code === 'PGRST116') {
        // "No rows found"
        return null;
      }
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Obtiene un usuario por su id (uuid).
   */
  static async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Actualiza el nombre de un usuario.
   */
  static async updateUser(userId, { name, email }) {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    updateFields.updated_at = new Date(); // Por si quieres actualizar la fecha

    const { data, error } = await supabase
      .from('users')
      .update(updateFields)
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }

  /**
   * Elimina un usuario (y las filas relacionadas si la DB está configurada con on delete cascade).
   */
  static async deleteUser(userId) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }
}

module.exports = UserModel;
