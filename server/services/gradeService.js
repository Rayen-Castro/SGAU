// server/services/gradeService.js
const grade = require("../server/models/grade");

// 1. GUARDAR O ACTUALIZAR UNA NOTA
exports.guardarCalificacion = async (datos) => {
  const { estudianteId, asignaturaId, nombreEval, calificacion, profesorId } =
    datos;

  // Regla de Negocio: Rango de calificación
  if (calificacion < 1.0 || calificacion > 7.0) {
    throw new Error("La calificación debe estar entre 1.0 y 7.0");
  }

  // Lógica de BD: Buscar existencia
  let notaExistente = await grade.findOne({
    estudiante: estudianteId,
    asignatura: asignaturaId,
    nombreEval: nombreEval,
  });

  // Regla de Negocio: Decidir si actualizar o crear
  if (notaExistente) {
    notaExistente.calificacion = calificacion;
    notaExistente.modificadoPor = profesorId;
    notaExistente.fechaModificacion = new Date();

    await notaExistente.save();
    return { nota: notaExistente, accion: "actualizada" };
  } else {
    const nuevaNota = new grade({
      estudiante: estudianteId,
      asignatura: asignaturaId,
      nombreEval,
      calificacion,
      modificadoPor: profesorId,
      fechaModificacion: new Date(),
    });

    await nuevaNota.save();
    return { nota: nuevaNota, accion: "creada" };
  }
};

// 2. OBTENER TODAS LAS NOTAS DE UNA ASIGNATURA ESPECÍFICA
exports.obtenerNotasPorAsignatura = async (asignaturaId) => {
  return await grade
    .find({ asignatura: asignaturaId })
    .populate("modificadoPor", "nombre correo");
};
