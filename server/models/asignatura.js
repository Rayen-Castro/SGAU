// server/models/Asignatura.js
const mongoose = require("mongoose");

const EvaluacionSchema = new mongoose.Schema({
  nombreEval: { type: String, required: true },
  ponderacion: { type: Number, required: true },
});

const AsignaturaSchema = new mongoose.Schema(
  {
    nombreAsignatura: { type: String, required: true, unique: true },
    codigo: { type: String, required: true, unique: true },
    periodo: { type: String, required: true },

    // Conexión con el modelo de Usuarios (Rol: Docente)
    docente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Lista de alumnos inscritos (Rol: Estudiante)
    estudiantesInscritos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    evaluaciones: [EvaluacionSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("asignatura", AsignaturaSchema);
