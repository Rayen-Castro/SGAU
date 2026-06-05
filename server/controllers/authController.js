const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// server/controllers/authController.js

exports.registrarUsuario = async (req, res) => {
    let { nombre, correo, password, rol, carrera } = req.body;

    try {
        let usuarioLimpio = correo.trim().toLowerCase();
        
        usuarioLimpio = usuarioLimpio.split('@')[0];
        
        usuarioLimpio = usuarioLimpio.replace('.alu', '').replace('alu', '');
        
        if (usuarioLimpio.endsWith('.')) {
            usuarioLimpio = usuarioLimpio.slice(0, -1);
        }

        if (rol === 'Estudiante') {
            correo = `${usuarioLimpio}@alu.uct.cl`;
        } else if (rol === 'Docente') {
            correo = `${usuarioLimpio}@uct.cl`;
        }
        let usuarioExiste = await User.findOne({ correo });
        if (usuarioExiste) {
            return res.status(400).json({ msg: `El correo institucional ${correo} ya está registrado en el sistema.` });
        }

        const nuevoUsuario = new User({ nombre, correo, password, rol, carrera });

        const salt = await bcrypt.genSalt(10);
        nuevoUsuario.password = await bcrypt.hash(password, salt);

        await nuevoUsuario.save();

        res.status(201).json({ 
            success: true, 
            msg: `Usuario [${rol}] creado con éxito. Correo asignado: ${correo}` 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al registrar usuario');
    }
};
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const usuario = await User.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({ msg: 'Credenciales inválidas (usuario no existe)' });
        }

        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.status(400).json({ msg: 'Credenciales inválidas (contraseña incorrecta)' });
        }

        const payload = {
            id: usuario._id,
            rol: usuario.rol
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET || 'firma_secreta_uct', 
            { expiresIn: '2h' }, 
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    user: {
                        _id: usuario._id,
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        rol: usuario.rol
                    }
                });
            }
        );

    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor durante el login');
    }
};

exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find().select('-password');
        res.json({ success: true, usuarios });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};