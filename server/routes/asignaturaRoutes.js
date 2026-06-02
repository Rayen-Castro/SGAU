// server/routes/asignaturaRoutes.js
const express = require('express');
const router = express.Router();
const asignaturaController = require('../controllers/asignaturaController');

// Ruta para crear (POST a /api/subjects/crear)
router.post('/crear', asignaturaController.crearAsignatura);

// Ruta para listar (GET a /api/subjects)
router.get('/', asignaturaController.obtenerAsignaturas);

module.exports = router;