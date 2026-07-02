// server/services/authService.js
const User = require("../models/User");
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

  let usuarioExiste = await User.findOne({ correo });
  if (usuarioExiste) {
    throw new Error(`UCT correo [${correo}] oĩma tembiporúpe. Eipuru ambue.`);
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHasheada = await bcrypt.hash(password, salt);

  const nuevoUsuario = new User({
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
  const usuario = await User.findOne({ correo });
  if (!usuario) {
    throw new Error("Monei ava ndoikói (Ava ndoikéi tembiporúpe)");
  }

  // Password comparison
  const match = await bcrypt.compare(password, usuario.password);
  if (!match) {
    throw new Error("Ñe'ẽñemi ndoikói (Eha'arã jey)");
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

// 3. (Renovar Access Token)
exports.renovarToken = async (refreshToken) => {
  try {
    const verificado = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "firma_refresh_secreta_uct",
    );

    const usuario = await User.findById(verificado.id);
    if (!usuario) {
      throw new Error("Ava ndoikói tembiporúpe");
    }

    const newAccessToken = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "firma_secreta_uct",
      { expiresIn: "15m" },
    );

    return { newAccessToken };
  } catch (error) {
    throw new Error(
      "Error al actualizar el token (vuelva a iniciar sesión en el servidor maestro).",
    );
  }
};

// 4. Obtener Usuarios
exports.obtenerUsuarios = async () => {
  return await User.find().select("-password");
};
