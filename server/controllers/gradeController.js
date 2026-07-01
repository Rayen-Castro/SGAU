// server/controllers/gradeController.js
const gradeService = require("../services/gradeService");

// 1. GUARDAR O ACTUALIZAR UNA NOTA
exports.guardarCalificacion = async (req, res) => {
  try {
    const resultado = await gradeService.guardarCalificacion(req.body);

    // El controlador decide el código HTTP según lo que hizo el servicio
    if (resultado.accion === "actualizada") {
      return res.json({
        success: true,
        msg: "Nota actualizada y auditada con éxito.",
        nota: resultado.nota,
      });
    } else {
      return res.status(201).json({
        success: true,
        msg: "Nota registrada con éxito.",
        nota: resultado.nota,
      });
    }
  } catch (error) {
    console.error(error);

    // Capturamos el error de validación específico
    if (error.message.includes("entre 1.0 y 7.0")) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }

    res.status(500).send("Error al procesar la calificación");
  }
};

// 2. OBTENER TODAS LAS NOTAS DE UNA ASIGNATURA ESPECÍFICA
exports.obtenerNotasPorAsignatura = async (req, res) => {
  const { asignaturaId } = req.params;

  try {
    const notas = await gradeService.obtenerNotasPorAsignatura(asignaturaId);
    res.json({ success: true, notas });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener las notas");
  }
};
