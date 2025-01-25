// src/controllers/exam.controller.js

const Papa = require('papaparse');
const { supabase } = require('../helpers/supabase');
const ExamModel = require('../models/exam.model');
const QuestionsModel = require('../models/questions.model');
const AnswersModel = require('../models/answers.model');

// ==================== GET /api/exams/current ====================
exports.getCurrentExam = async (req, res) => {
  try {
    const exam = await ExamModel.getCurrentExam();
    if (!exam) {
      return res.status(404).json({ error: 'No hay examen actual' });
    }
    return res.json({ exam });
  } catch (error) {
    console.error('[getCurrentExam] Error:', error);
    return res.status(500).json({ error: 'No se pudo obtener el examen actual' });
  }
};

// ==================== GET /api/exams/:examId/questions ====================
exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
    const questions = await QuestionsModel.getQuestionsByExamId(examId);
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// src/controllers/exam.controller.js
exports.getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    // userId (según auth)
    const userId = req.user && req.user.id ? req.user.id : req.body.user_id;

    // 1) Busca en exam_results
    const { data, error } = await supabase
      .from('exam_results')
      .select('final_score, created_at')
      .eq('user_id', userId)
      .eq('exam_id', examId)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: 'No se encontró resultado para este examen.' });
    }

    // 2) Si quieres devolver also las “answersWithQuestions”, haz un join,
    //    o reusa AnswersModel.getAnswersWithQuestions(userId, examId).
    //    Ejemplo:
    const answersWithQuestions = await AnswersModel.getAnswersWithQuestions(userId, examId);

    return res.json({
      finalScore: data.final_score,
      date: data.created_at,
      // answersWithQuestions
    });
  } catch (err) {
    console.error('[getExamResults] Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
exports.getExamComparison = async (req, res) => {
  try {
    const { examId } = req.params;

    // Ejemplo de aggregator con percentile_cont
    const query = `
      select
        percentile_cont(0.8) within group (order by final_score) as p80,
        percentile_cont(0.7) within group (order by final_score) as p70,
        percentile_cont(0.6) within group (order by final_score) as p60,
        avg(final_score) as media
      from exam_results
      where exam_id = '${examId}'
    `;

    // con supabase, no hay .sql() nativo en supabase-js v1/2. 
    // Podrías hacer .rpc() a una función o usar supabase Edge Function.
    // A modo de ejemplo, te doy la idea:

    const { data, error } = await supabase
      .rpc('exam_percentiles', { exam_id_input: examId }); 
    // asumiendo que creaste la function en la BD:
    // create or replace function exam_percentiles(exam_id_input uuid)
    // returns table (p80 numeric, p70 numeric, p60 numeric, media numeric)
    // language sql as $$
    //   select ...
    // $$;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ stats: data });
  } catch (err) {
    console.error('[getExamComparison] Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ==================== POST /api/exams/upload-csv ====================
exports.uploadCsv = async (req, res) => {
  try {
    // 1) Campos adicionales en el body (FormData)
    const { examId, start_date, zoom_url, end_date } = req.body;

    // 2) Verifica que haya archivo CSV
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo CSV' });
    }

    // 3) Parsear el CSV con Papaparse
    const csvString = req.file.buffer.toString('utf-8');
    const parsed = Papa.parse(csvString, {
      header: true,
      skipEmptyLines: true
    });

    if (parsed.errors.length > 0) {
      console.error('Errores al parsear CSV:', parsed.errors);
      return res.status(400).json({
        error: 'Error al parsear CSV',
        details: parsed.errors
      });
    }

    const rows = parsed.data;
    if (!rows.length) {
      return res.status(400).json({ error: 'El CSV no contiene filas de datos' });
    }

    // 4) Crear o actualizar el examen
    //    - Si examId viene en el body, asumimos que existe y lo actualizamos.
    //    - Si NO hay examId, creamos un examen nuevo con start_date, zoom_url, etc.
    let finalExamId = examId;

    if (!examId) {
      // Creamos un nuevo examen (puedes darle un title fijo o recogerlo del body)
      const createPayload = {
        title: 'Examen CSV',  // o req.body.title
        start_date: start_date || null,
        end_date: end_date || null,
        zoom_url: zoom_url || null,
        // user_id: req.user.id (si quieres asociar a un usuario)
      };

      // Usando supabase directamente (o tu ExamModel)
      const { data: examData, error: examErr } = await supabase
        .from('exams')
        .insert([createPayload])
        .single();

      if (examErr) {
        throw new Error(`Error al crear examen: ${examErr.message}`);
      }
      finalExamId = examData.id;
    } else {
      // Actualizamos un examen existente
      const updatePayload = {
        start_date: start_date || null,
        end_date: end_date || null,
        zoom_url: zoom_url || null,
      };
      const { data: updatedExam, error: updateErr } = await supabase
        .from('exams')
        .update(updatePayload)
        .eq('id', examId)
        .single();

      if (updateErr) {
        throw new Error(`Error al actualizar examen: ${updateErr.message}`);
      }
      finalExamId = updatedExam.id;
    }

    // 5) Construimos el array de preguntas para la BD
    //    Asumiendo que tus filas tienen text, option_a, option_b, option_c, correct_option, topic, feedback...
    const questionsArray = rows.map((row) => ({
      exam_id: finalExamId,
      text: row.text,
      option_a: row.option_a,
      option_b: row.option_b,
      option_c: row.option_c,
      correct_option: row.correct_option,
      topic: row.topic,
      feedback: row.feedback || ''
    }));

    // 6) Insertar preguntas en la tabla 'questions'
    const { data: insertedQuestions, error: qErr } = await supabase
      .from('questions')
      .insert(questionsArray);

    if (qErr) {
      throw new Error(`Error al insertar preguntas: ${qErr.message}`);
    }

    // 7) Respuesta final
    return res.json({
      message: 'CSV subido e insertado correctamente',
      examId: finalExamId,
      insertedCount: insertedQuestions.length
    });
  } catch (err) {
    console.error('[uploadCsv] Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// ==================== POST /api/exams/submit-answers ====================
exports.submitAnswers = async (req, res) => {
  try {
    const { answers, totalQuestions } = req.body;
    // answers = [{ user_id, exam_id, question_id, selected_option, is_correct }, ... ]

    // Insertamos las respuestas
    const inserted = await AnswersModel.insertAnswers(answers);

    // Calculamos la nota localmente
    const finalScore = AnswersModel.calculateScore(inserted, totalQuestions);

    res.json({
      message: 'Examen enviado (submitAnswers) correctamente',
      finalScore
    });
  } catch (error) {
    console.error('[submitAnswers] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== POST /api/exams/:examId/submitExam ====================
// src/controllers/exam.controller.js

exports.submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    // userId tomado del token, o del body si no hay auth
    const userId = req.user && req.user.id ? req.user.id : req.body.user_id;

    const { answers, totalQuestions } = req.body;
    // answers = [{ user_id, exam_id, question_id, selected_option }, ...]

    // 1) Insertamos las respuestas (AnswersModel)
    const insertedAnswers = await AnswersModel.insertAnswers(answers);

    // 2) Calculamos la nota
    const finalScore = AnswersModel.calculateScore(insertedAnswers, totalQuestions);

    // 3) Insertar la nota final en exam_results
    //    Usamos supabase directamente, o un model (ExamResultsModel) si creas uno
    const { data: resultsData, error: resultsErr } = await supabase
      .from('exam_results')
      .insert([
        {
          user_id: userId,
          exam_id: examId,
          final_score: finalScore
        }
      ]);

    if (resultsErr) {
      throw new Error(`Error al guardar final_score en exam_results: ${resultsErr.message}`);
    }

    // 4) Obtenemos las respuestas con la info de la pregunta (feedback) si quieres
    const answersWithQuestions = await AnswersModel.getAnswersWithQuestions(userId, examId);

    // 5) Retornamos todo al front
    return res.json({
      message: 'Examen enviado (submitExam) correctamente',
      finalScore,
      answersWithQuestions
    });
  } catch (error) {
    console.error('[submitExam] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

