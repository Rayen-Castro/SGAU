// server/services/authService.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTRAR USUARIO
exports.registrarUsuario = async (datos) => {
  let { nombre, correo, password, rol, carrera } = datos;

  // Regla de negocio: Formatear y asignar correo UCT
  let usuarioLimpio = correo.trim().toLowerCase();
  usuarioLimpio = usuarioLimpio.split("@")[0];
  usuarioLimpio = usuarioLimpio.replace(".alu", "").replace("alu", "");

  if (usuarioLimpio.endsWith(".")) {
    usuarioLimpio = usuarioLimpio.slice(0, -1);
  }

  if (rol === "Estudiante") {
    correo = `${usuarioLimpio}@alu.uct.cl`;
  } else if (rol === "Docente") {
    correo = `${usuarioLimpio}@uct.cl`;
  }

  // Regla de negocio: Verificar si el correo ya existe
  let usuarioExiste = await User.findOne({ correo });
  if (usuarioExiste) {
    throw new Error(
      `El correo institucional ${correo} ya está registrado en el sistema.`,
    );
  }

  // Regla de negocio: Hashear la contraseña
  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(password, salt);

  // Lógica de base de datos
  const nuevoUsuario = new User({
    nombre,
    correo,
    password: passwordHasheada,
    rol,
    carrera,
  });
  await nuevoUsuario.save();

  // Devolvemos los datos necesarios para armar el mensaje de éxito en el controlador
  return { rol, correo };
};

// 2. INICIO DE SESIÓN (LOGIN)
exports.login = async (correo, password) => {
  // Lógica de negocio y BD: Verificar credenciales
  const usuario = await User.findOne({ correo });
  if (!usuario) {
    throw new Error("Credenciales inválidas (usuario no existe)");
  }

  const match = await bcrypt.compare(password, usuario.password);
  if (!match) {
    throw new Error("Credenciales inválidas (contraseña incorrecta)");
  }

  // Regla de negocio: Firmar el token JWT
  const payload = { id: usuario._id, rol: usuario.rol };

  // Usamos la versión síncrona de jwt.sign para mantener el servicio limpio sin callbacks
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || "firma_secreta_uct",
    { expiresIn: "2h" },
  );

  return {
    token,
    user: {
      _id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    },
  };
};

// 3. OBTENER USUARIOS
exports.obtenerUsuarios = async () => {
  return await User.find().select("-password");
};
