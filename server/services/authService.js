// server/services/authService.js
const user = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. REGISTRAR USUARIO
exports.registrarUsuario = async (datos) => {
  let { nombre, correo, password, rol, carrera } = datos;

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

  let usuarioExiste = await user.findOne({ correo });
  if (usuarioExiste) {
    throw new Error(
      `El correo UCT [${correo}] ya está registrado. Utilice otro.`,
    );
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(password, salt);

  const nuevoUsuario = new user({
    nombre,
    correo,
    password: passwordHasheada,
    rol,
    carrera,
  });
  await nuevoUsuario.save();

  return { rol, correo };
};

// 2. INICIO DE SESIÓN
exports.login = async (correo, password) => {
  const usuario = await user.findOne({ correo });
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  // Comparación de contraseñas
  const match = await bcrypt.compare(password, usuario.password);
  if (!match) {
    throw new Error("Contraseña incorrecta");
  }

  const payloadAccess = { id: usuario._id, rol: usuario.rol };
  const payloadRefresh = { id: usuario._id };

  // Access Token (15 min) Refresh Token (7 days)
  const accessToken = jwt.sign(
    payloadAccess,
    process.env.JWT_SECRET || "firma_secreta_uct",
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    payloadRefresh,
    process.env.JWT_REFRESH_SECRET || "firma_refresh_secreta_uct",
    { expiresIn: "7d" },
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    },
  };
};

// 3. RENOVAR ACCESS TOKEN
exports.renovarToken = async (refreshToken) => {
  try {
    const verificado = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "firma_refresh_secreta_uct",
    );

    const usuario = await user.findById(verificado.id);
    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    const newAccessToken = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "firma_secreta_uct",
      { expiresIn: "15m" },
    );

    return { newAccessToken };
  } catch (error) {
    throw new Error("Error al actualizar el token. Vuelva a iniciar sesión.");
  }
};

// 4. OBTENER USUARIOS
exports.obtenerUsuarios = async () => {
  return await user.find().select("-password");
};
