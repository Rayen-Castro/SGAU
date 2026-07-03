// server/controllers/asignaturaController.js
const asignaturaService = require("../services/asignaturaService");

// 1. CREAR UNA ASIGNATURA CON SU PLAN DE EVALUACIONES
exports.crearAsignatura = async (req, res) => {
  try {
    const nuevaAsignatura = await asignaturaService.crearAsignatura(req.body);

    res.status(201).json({
      success: true,
      msg: `Asignatura [${nuevaAsignatura.nombreAsignatura}] creada con éxito con ${nuevaAsignatura.evaluaciones.length} evaluaciones.`,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "El nombre o código de la asignatura ya existe.",
      });
    }

    if (error.message.includes("ponderaciones")) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }

    res.status(500).send("Error al crear la asignatura");
  }
};

// 2. OBTENER ASIGNATURAS
exports.obtenerAsignaturas = async (req, res) => {
  try {
    const asignaturas = await asignaturaService.obtenerTodas();
    res.json({ success: true, asignaturas });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener las asignaturas");
  }
};

// 3. OBTENER ASIGNATURAS ESPECÍFICAS DE UN DOCENTE
exports.obtenerAsignaturasDocente = async (req, res) => {
  try {
    const { docenteId } = req.params;
    const asignaturas = await asignaturaService.obtenerPorDocente(docenteId);
    res.json({ success: true, asignaturas });
  } catch (error) {
    console.error("Error en obtenerAsignaturasDocente:", error);
    res.status(500).send("Error al obtener las asignaturas del docente");
  }
};

// 4. OBTENER ASIGNATURAS DONDE UN ESTUDIANTE ESTÁ INSCRITO
exports.obtenerAsignaturasEstudiante = async (req, res) => {
  try {
    const { estudianteId } = req.params;
    const asignaturas =
      await asignaturaService.obtenerPorEstudiante(estudianteId);
    res.json({ success: true, asignaturas });
  } catch (error) {
    console.error("Error en obtenerAsignaturasEstudiante:", error);
    res.status(500).send("Error al obtener las asignaturas del estudiante");
  }
};

// 5. ACTUALIZAR ASIGNATURA
exports.actualizarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;

    const asignaturaActualizada = await asignaturaService.actualizarAsignatura(
      id,
      req.body,
    );

    if (!asignaturaActualizada) {
      return res.status(404).json({
        success: false,
        msg: "No se encontró la asignatura especificada.",
      });
    }

    res.json({
      success: true,
      msg: `Asignatura [${asignaturaActualizada.nombreAsignatura}] modificada con éxito.`,
      asignatura: asignaturaActualizada,
    });
  } catch (error) {
    console.error("Error en actualizarAsignatura:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "El nombre o código de la asignatura ya existe.",
      });
    }

    if (error.message?.includes("ponderaciones")) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }

    res.status(500).send("Error al actualizar la asignatura");
  }
};

// 6. ELIMINAR ASIGNATURA
exports.eliminarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;

    const asignaturaEliminada = await asignaturaService.eliminarAsignatura(id);

    if (!asignaturaEliminada) {
      return res.status(404).json({
        success: false,
        msg: "No se encontró la asignatura especificada.",
      });
    }

    res.json({
      success: true,
      msg: "Asignatura eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error en eliminarAsignatura:", error);
    res.status(500).send("Error al eliminar la asignatura");
  }
};
