const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

router.post('/guardar', gradeController.guardarCalificacion);

router.get('/asignatura/:asignaturaId', gradeController.obtenerNotasPorAsignatura);

module.exports = router;