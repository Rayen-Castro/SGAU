// server/models/Asignatura.js
const mongoose = require('mongoose');

const EvaluacionSchema = new mongoose.Schema({
    nombreEval: { type: String, required: true }, // Ej: "Certamen 1"
    ponderacion: { type: Number, required: true }  // Ej: 30 (significa 30%)
});

const AsignaturaSchema = new mongoose.Schema({
    nombreAsignatura: { type: String, required: true, unique: true },
    codigo: { type: String, required: true, unique: true }, // Ej: "INF-4102"
    periodo: { type: String, required: true }, // Ej: "2026-1"
    
    // Conexión con el modelo de Usuarios (Rol: Docente)
    docente: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // Lista de alumnos inscritos (Rol: Estudiante)
    estudiantesInscritos: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    
    // Estructura de evaluaciones fijada para el semestre
    evaluaciones: [EvaluacionSchema]
}, { timestamps: true });

module.exports = mongoose.model('asignatura', AsignaturaSchema);