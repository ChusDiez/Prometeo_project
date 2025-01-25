// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// GET /api/admin/users-scores
router.get('/users-scores', adminController.getUsersScores);
router.get('/exams-stats', adminController.getExamsStats);

// (Opcional) aquí puedes poner otros endpoints de admin 
// ej: router.get('/exams-stats', adminController.getExamsStats);

module.exports = router;
