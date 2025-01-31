// src/models/exam.model.js
const { supabase } = require('../helpers/supabase');

class ExamModel {
  /**
   * Crea un examen nuevo en la tabla 'exams'.
   * user_id = el id del usuario que lo crea (relacionado con public.users.id).
   */
  static async createExam({ title, start_date, end_date, zoom_url, user_id }) {
    const { data, error } = await supabase
      .from('exams')
      .insert([{
        title,
        start_date,
        end_date,
        zoom_url,
        user_id
      }]);

    if (error) {
      throw new Error(error.message);
    }
    return data[0];
  }
  static async getCurrentExam() {
    // Ejemplo: buscar el primer examen cuya fecha de inicio sea
    // >= ahora y que no haya empezado todavía
    const nowISO = new Date().toISOString();

    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .gte('start_date', nowISO)
      .order('start_date', { ascending: true })
      .limit(1);

    if (error) throw new Error(error.message);

    // data será un array, si no hay registros => length = 0
    return data.length ? data[0] : null;
  }
  /**
   * Obtiene un examen por su ID.
   */
  static async getExamById(examId) {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('id', examId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Lista exámenes de un usuario (por user_id).
   */
  static async getExamsByUser(userId) {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Actualiza un examen.
   */
  static async updateExam(examId, newData) {
    // newData: { title, start_date, end_date, zoom_url, ... }
    newData.updated_at = new Date();
    const { data, error } = await supabase
      .from('exams')
      .update(newData)
      .eq('id', examId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Elimina un examen.
   */
  static async deleteExam(examId) {
    const { data, error } = await supabase
      .from('exams')
      .delete()
      .eq('id', examId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}

module.exports = ExamModel;
