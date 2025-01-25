// src/models/answers.model.js
const { supabase } = require('../helpers/supabase');

class AnswersModel {
  /**
   * Inserta un array de respuestas ya preparadas.
   * Cada objeto del array debe tener { user_id, exam_id, question_id, selected_option, is_correct }
   */
  static async insertAnswersArray(answersArray) {
    const { data, error } = await supabase
      .from('answers')
      .insert(answersArray);

    if (error) {
      throw new Error(error.message);
    }
    return data; // array de filas insertadas
  }

  /**
   * Inserta respuestas a partir de un "answersObj" = { qId1: 'A', qId2: 'C', ... }
   * - userId y examId para asociar a la tabla 'answers'
   * - Este método compara selected_option con la BD para calcular "is_correct"
   */
  static async insertAnswersObject(userId, examId, answersObj) {
    // Necesitamos tener un método o lógica para saber si "selectedOption" coincide con la "correct_option"
    // Por ejemplo:
    const arrayToInsert = [];

    for (const [questionId, selectedOption] of Object.entries(answersObj)) {
      const isCorrect = await AnswersModel.compareWithDB(questionId, selectedOption);
      arrayToInsert.push({
        user_id: userId,
        exam_id: examId,
        question_id: questionId,
        selected_option: selectedOption,
        is_correct: isCorrect,
      });
    }

    // Insertar en la tabla 'answers'
    const { data, error } = await supabase
      .from('answers')
      .insert(arrayToInsert);

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * EJEMPLO de método para comparar la opción marcada con la tabla 'questions'.
   * Devuelve true si "selectedOption" coincide con "correct_option".
   */
  static async compareWithDB(questionId, selectedOption) {
    // Buscar la pregunta en "questions"
    const { data, error } = await supabase
      .from('questions')
      .select('correct_option')
      .eq('id', questionId)
      .single();

    if (error) {
      throw new Error('No se pudo obtener la pregunta de la BD');
    }

    return data.correct_option === selectedOption;
  }

  /**
   * Devuelve respuestas junto con la info de 'questions'
   * Requiere tener una relación en Supabase de answers.question_id -> questions.id
   */
  static async getAnswersWithQuestions(userId, examId) {
    const { data, error } = await supabase
      .from('answers')
      .select(`
        id,
        question_id,
        selected_option,
        is_correct,
        questions!inner (
          text,
          option_a,
          option_b,
          option_c,
          correct_option,
          feedback
        )
      `)
      .eq('user_id', userId)
      .eq('exam_id', examId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Calcula la nota final usando la fórmula:
   *    nota = 10 * (aciertos - errores/2) / totalPreguntas
   */
  static calculateScore(answersArray, totalQuestions) {
    const aciertos = answersArray.filter((ans) => ans.is_correct).length;
    const errores = answersArray.length - aciertos;

    let rawScore = (10 * (aciertos - errores / 2)) / totalQuestions;
    if (rawScore < 0) rawScore = 0;
    return rawScore;
  }
}

module.exports = AnswersModel;
