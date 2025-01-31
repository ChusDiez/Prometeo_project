// src/models/questions.model.js
const { supabase } = require('../helpers/supabase');

class QuestionsModel {
  /**
   * Inserta un array de preguntas (por ejemplo, provenientes de un CSV).
   * Cada objeto del array debe tener:
   * {
   *   exam_id,
   *   text,
   *   option_a,
   *   option_b,
   *   option_c,
   *   correct_option,
   *   topic,
   *   feedback (opcional, si lo incluyes en la BD)
   * }
   */
  static async insertQuestions(questionsArray) {
    const { data, error } = await supabase
      .from('questions')
      .insert(questionsArray);

    if (error) {
      throw new Error(error.message);
    }
    return data; // Devuelve las filas insertadas
  }

  /**
   * Obtiene las preguntas de un examen por exam_id.
   * Retorna array de objetos. Cada objeto contiene
   * { id, exam_id, text, option_a, option_b, option_c, correct_option, topic, feedback, ... }
   */
  static async getQuestionsByExamId(examId) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', examId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * (Opcional) Actualiza una pregunta (por si editas la pregunta en el dashboard).
   */
  static async updateQuestion(questionId, newData) {
    newData.updated_at = new Date();
    const { data, error } = await supabase
      .from('questions')
      .update(newData)
      .eq('id', questionId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * (Opcional) Elimina una pregunta.
   */
  static async deleteQuestion(questionId) {
    const { data, error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}

module.exports = QuestionsModel;
