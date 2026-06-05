// server/controllers/asignaturaController.js
const asignatura = require('../models/asignatura');

// 1. CREAR UNA ASIGNATURA CON SU PLAN DE EVALUACIONES
exports.crearAsignatura = async (req, res) => {
    const { nombreAsignatura, codigo, periodo, docenteId, estudiantesIds, evaluaciones } = req.body;

    try {
        // Validación crítica: Las ponderaciones deben sumar exactamente 100%
        const sumaPonderaciones = evaluaciones.reduce((total, eval) => total + Number(eval.ponderacion), 0);
        
        if (sumaPonderaciones !== 100) {
            return res.status(400).json({ 
                success: false, 
                msg: `La suma de las ponderaciones es ${sumaPonderaciones}%. Debe ser exactamente 100%.` 
            });
        }

        // Crear la asignatura en la base de datos
        const nuevaAsignatura = new asignatura({
            nombreAsignatura,
            codigo,
            periodo,
            docente: docenteId,
            estudiantesInscritos: estudiantesIds,
            evaluaciones
        });

        await nuevaAsignatura.save();
        res.status(201).json({ 
            success: true, 
            msg: `Asignatura [${nombreAsignatura}] creada con éxito con ${evaluaciones.length} evaluaciones.` 
        });

    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ success: false, msg: 'El nombre o código de la asignatura ya existe.' });
        }
        res.status(500).send('Error al crear la asignatura');
    }
};

// 2. OBTENER ASIGNATURAS (Para verlas en el sistema)
exports.obtenerAsignaturas = async (req, res) => {
    try {
        // Traemos las asignaturas, trayendo también el nombre del docente y de los alumnos (populate)
        const asignaturas = await asignatura.find()
            .populate('docente', 'nombre correo')
            .populate('estudiantesInscritos', 'nombre correo carrera');
        res.json({ success: true, asignaturas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las asignaturas');
    }
};

// 3. OBTENER ASIGNATURAS ESPECÍFICAS DE UN DOCENTE
exports.obtenerAsignaturasDocente = async (req, res) => {
    try {
        const { docenteId } = req.params;

        // Buscamos las asignaturas cuyo campo 'docente' sea igual al ID enviado
        const asignaturas = await asignatura.find({ docente: docenteId })
            .populate('docente', 'nombre correo')
            .populate('estudiantesInscritos', 'nombre correo carrera');

        res.json({ success: true, asignaturas });
    } catch (error) {
        console.error("Error en obtenerAsignaturasDocente:", error);
        res.status(500).send('Error al obtener las asignaturas del docente');
    }
};