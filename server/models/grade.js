// server/models/Grade.js
const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema(
  {
    estudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    asignatura: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "asignatura",
      required: true,
    },
    nombreEval: {
      type: String,
      required: true,
    },
    calificacion: {
      type: Number,
      required: true,
      min: 1.0,
      max: 7.0,
    },
    modificadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Esto genera automáticamente "createdAt" y "updatedAt" (Fecha y hora)
  },
);

module.exports = mongoose.model("grade", GradeSchema);
