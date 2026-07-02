// server/services/asignaturaService.js
const Asignatura = require("../models/asignatura");

// 1. CREAR ASIGNATURA
exports.crearAsignatura = async (datosAsignatura) => {
  // Regla de Negocio: Validar que las ponderaciones sumen 100
  const sumaPonderaciones = datosAsignatura.evaluaciones.reduce(
    (total, evaluación) => total + Number(evaluación.ponderacion),
    0,
  );

  if (sumaPonderaciones !== 100) {
    // Lanzamos un error que el controlador capturará
    throw new Error(
      `La suma de las ponderaciones es ${sumaPonderaciones}%. Debe ser exactamente 100%.`,
    );
  }

  // Lógica de Base de Datos: Crear y guardar
  const nuevaAsignatura = new Asignatura(datosAsignatura);
  return await nuevaAsignatura.save();
};

// 2. OBTENER TODAS LAS ASIGNATURAS
exports.obtenerTodas = async () => {
  return await Asignatura.find()
    .populate("docente", "nombre correo")
    .populate("estudiantesInscritos", "nombre correo carrera");
};

// 3. OBTENER ASIGNATURAS POR DOCENTE
exports.obtenerPorDocente = async (docenteId) => {
  return await Asignatura.find({ docente: docenteId })
    .populate("docente", "nombre correo")
    .populate("estudiantesInscritos", "nombre correo carrera");
};

// 4. OBTENER ASIGNATURAS POR ESTUDIANTE
exports.obtenerPorEstudiante = async (estudianteId) => {
  return await Asignatura.find({ estudiantesInscritos: estudianteId })
    .populate("docente", "nombre correo")
    .lean();
};
