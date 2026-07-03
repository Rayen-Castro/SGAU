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

// 5. ACTUALIZAR ASIGNATURA (Con Validación de Regla de Negocio)
exports.actualizarAsignatura = async (id, datosActualizados) => {
  if (datosActualizados.evaluaciones) {
    const sumaPonderaciones = datosActualizados.evaluaciones.reduce(
      (total, evaluacion) => total + Number(evaluacion.ponderacion),
      0,
    );

    if (sumaPonderaciones !== 100) {
      throw new Error(
        `La suma de las ponderaciones actualizadas es ${sumaPonderaciones}%. Debe ser exactamente 100%.`,
      );
    }
  }

  return await Asignatura.findByIdAndUpdate(id, datosActualizados, {
    new: true,
    runValidators: true,
  })
    .populate("docente", "nombre correo")
    .populate("estudiantesInscritos", "nombre correo carrera");
};

// 6. ELIMINAR ASIGNATURA
exports.eliminarAsignatura = async (id) => {
  return await Asignatura.findByIdAndDelete(id);
};
