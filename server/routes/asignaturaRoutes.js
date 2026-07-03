const express = require("express");
const router = express.Router();
const asignaturaController = require("../controllers/asignaturaController");

// 1. Ruta para crear (POST a /api/subjects/crear)
router.post("/crear", asignaturaController.crearAsignatura);

// 2. Ruta para listar todas las asignaturas (GET a /api/subjects)
router.get("/", asignaturaController.obtenerAsignaturas);

// 3. Ruta para obtener asignaturas de un docente específico
router.get(
  "/docente/:docenteId",
  asignaturaController.obtenerAsignaturasDocente,
);

// 4. Ruta para obtener asignaturas de un estudiante específico
router.get(
  "/estudiante/:estudianteId",
  asignaturaController.obtenerAsignaturasEstudiante,
);

// 5. Ruta para actualizar una asignatura (PUT a /api/asignatura/:id)
router.put("/:id", asignaturaController.actualizarAsignatura);

// 6. Ruta para eliminar una asignatura (DELETE a /api/subjects/:id)
router.delete("/:id", asignaturaController.eliminarAsignatura);

module.exports = router;
