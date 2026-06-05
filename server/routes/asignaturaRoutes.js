// server/routes/asignaturaRoutes.js
const express = require('express');
const router = express.Router();
const asignaturaController = require('../controllers/asignaturaController');

// Ruta para crear (POST a /api/subjects/crear)
router.post('/crear', asignaturaController.crearAsignatura);

// Ruta para listar (GET a /api/subjects)
router.get('/', asignaturaController.obtenerAsignaturas);

router.get('/docente/:docenteId', asignaturaController.obtenerAsignaturasDocente);

router.get('/estudiante/:estudianteId', asignaturaController.obtenerAsignaturasEstudiante);

// Ruta para obtener asignaturas de un docente específico
router.get('/docente/:docenteId', async (req, res) => {
    try {
        const Subject = require('../models/Subject');
        const asignaturas = await Subject.find({ docente: req.params.docenteId })
            .populate('estudiantesInscritos', 'nombre correo carrera');
        res.json({ success: true, asignaturas });
    } catch (error) {
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;