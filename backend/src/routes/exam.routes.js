// src/routes/exam.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const examController = require('../controllers/exam.controller');

const upload = multer(); // config muler in-memory

// GET /api/exams/current -> lobby
router.get('/current', examController.getCurrentExam);
// exam.routes.js
router.get('/:examId/questions', examController.getExamQuestions);
// Ruta para subir CSV
router.post('/upload-csv', upload.single('csvFile'), examController.uploadCsv);
// Ruta para un submit "simple"
router.post('/submit-answers', examController.submitAnswers);
// Ruta para un submit "completo" con feedback
router.post('/:examId/submitExam', examController.submitExam);
router.get('/:examId/results', examController.getExamResults);
router.get('/:examId/comparison', examController.getExamComparison);

module.exports = router;
