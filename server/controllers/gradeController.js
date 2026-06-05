const Grade = require("../models/Grade");
const asignatura = require("../models/asignatura");

// 1. GUARDAR O ACTUALIZAR UNA NOTA
exports.guardarCalificacion = async (req, res) => {
  // 1. Extraemos las variables que viajan desde el FETCH del frontend
  const {
    estudianteId,
    asignaturaId,
    nombreEval,
    calificacion,
    profesorId,
    modificadoPor,
  } = req.body;

  try {
    if (calificacion < 1.0 || calificacion > 7.0) {
      return res
        .status(400)
        .json({
          success: false,
          msg: "La calificación debe estar entre 1.0 y 7.0",
        });
    }

    let notaExistente = await Grade.findOne({
      estudiante: estudianteId,
      asignatura: asignaturaId,
      nombreEval: nombreEval,
    });

    if (notaExistente) {
      notaExistente.calificacion = calificacion;
      // Guardamos el ID para el populate, o el texto si tu modelo almacena Strings
      notaExistente.modificadoPor = profesorId;

      // 🕒 Forzamos la actualización de la fecha manualmente si no usas timestamps
      notaExistente.fechaModificacion = new Date();

      await notaExistente.save();
      return res.json({
        success: true,
        msg: "Nota actualizada y auditada con éxito.",
        nota: notaExistente,
      });
    } else {
      const nuevaNota = new Grade({
        estudiante: estudianteId,
        asignatura: asignaturaId,
        nombreEval,
        calificacion,
        modificadoPor: profesorId,
        fechaModificacion: new Date(), // 🕒 Registro de tiempo inicial
      });
      await nuevaNota.save();
      return res
        .status(201)
        .json({
          success: true,
          msg: "Nota registrada con éxito.",
          nota: nuevaNota,
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar la calificación");
  }
};

// 2. OBTENER TODAS LAS NOTAS DE UNA ASIGNATURA ESPECÍFICA
exports.obtenerNotasPorAsignatura = async (req, res) => {
  const { asignaturaId } = req.params;

  try {
    const notas = await Grade.find({ asignatura: asignaturaId }).populate(
      "modificadoPor",
      "nombre correo",
    );
    res.json({ success: true, notas });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener las notas");
  }
};
