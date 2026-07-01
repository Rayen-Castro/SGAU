// server/controllers/asignaturaController.js
const asignaturaService = require("../services/asignaturaService");

// 1. CREAR UNA ASIGNATURA CON SU PLAN DE EVALUACIONES
exports.crearAsignatura = async (req, res) => {
  try {
    // El controlador solo delega la tarea al servicio pasándole el body
    const nuevaAsignatura = await asignaturaService.crearAsignatura(req.body);

    res.status(201).json({
      success: true,
      msg: `Asignatura [${nuevaAsignatura.nombreAsignatura}] creada con éxito con ${nuevaAsignatura.evaluaciones.length} evaluaciones.`,
    });
  } catch (error) {
    console.error(error);

    // Capturamos el error de llave duplicada de MongoDB
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: "El nombre o código de la asignatura ya existe.",
      });
    }

    // Capturamos el error de validación del 100% que lanzamos desde el servicio
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
